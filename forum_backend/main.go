package main

import (
	"fmt"
	"forum_backend/backend"
	"forum_backend/frontend"
	"forum_backend/models"
	"forum_backend/storage"
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"gorm.io/gorm"
)

type Respository struct {
	DB *gorm.DB
}

// create new user if user does not exist
func (r *Respository) CreateUser(c *fiber.Ctx) error {

	var count int64
	user := &backend.User{}

	// parse data into `user` dataType
	if err := c.BodyParser(user); err != nil {
		return err
	}

	// get the count of user
	if err := r.DB.Model(&models.User{}).Where("name = ?", user.Name).Count(&count).Error; err != nil {
		c.Status(404).JSON(fiber.Map{"err": "could not get the count of user"})
	}

	// the count will be zero if the user does not exist in the database, thus we need to create new user
	if count == 0 {
		newUser := &backend.User{}
		newUser.Name = user.Name
		if err := r.DB.Create(newUser).Error; err != nil {
			c.Status(404).JSON(fiber.Map{"err": "could not create new user"})
		}
	}
	return c.Status(200).JSON(user)
}

// get the the list of item_id that are liked by the current user
func (r *Respository) getIdList(userId uint, itemType string, ids *[]uint) error {

	// stores the list of id in ids
	if err := r.DB.Model(&models.LikedItem{}).
		Select(fmt.Sprintf("%s_id", itemType)).
		Where("user_id = ? AND is_post = ?", userId, itemType == "post").
		Find(ids).Error; err != nil {
		return err
	}
	return nil
}

// check if the id is in item_ids
func isClicked(id uint, item_ids *[]uint) bool {

	for _, item_id := range *item_ids {
		if item_id == id {
			return true
		}
	}
	return false
}

// fill in the data required in the post, which is the structure needed by the frontend system
func (r *Respository) FillInForumPost(c *fiber.Ctx, fp *frontend.Post, p *models.Post,
	clicked_post_ids *[]uint, clicked_comment_ids *[]uint) error {

	fp.ID = p.ID
	fp.Title = p.Title
	fp.Like = p.Like
	fp.Clicked = isClicked(p.ID, clicked_post_ids)

	// get the username of the user that create the post
	creator := &models.User{}
	if err := r.DB.First(creator, p.UserID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"err": "could not get user"})
	}
	fp.User = creator.Name

	// get the comments of the post in ascending order
	comments := []models.Comment{}
	if err := r.DB.Where("post_id = ?", p.ID).Order("ID").Find(&comments).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"err": "could not get post's comments"})
	}

	// get the list of comments in the structure needed by the frontend system
	forumComments := []frontend.Comment{}
	for _, comment := range comments {
		forumComment := frontend.Comment{}
		if err := r.FillInForumComment(c, &forumComment, &comment, clicked_comment_ids); err != nil {
			return err
		}
		forumComments = append(forumComments, forumComment)
	}
	fp.Comments = forumComments
	return nil
}

// fill in the data required in the comment, which is the structure needed by the frontend system
func (r *Respository) FillInForumComment(c *fiber.Ctx, fc *frontend.Comment, cm *models.Comment, clicked_comment_ids *[]uint) error {

	fc.ID = cm.ID
	fc.Content = cm.Content
	fc.Like = cm.Like
	fc.Clicked = isClicked(cm.ID, clicked_comment_ids)

	// get the username of the user that create the comment
	creator := &models.User{}
	if err := r.DB.First(creator, cm.UserID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"err": "could not get comment's user"})
	}
	fc.User = creator.Name
	return nil
}

// get the list of post in the structure needed by the frontend
func (r *Respository) GetForumPosts(c *fiber.Ctx) error {

	posts := []models.Post{}
	forumPosts := []frontend.Post{}
	curUser := models.User{}
	var clicked_post_ids []uint
	var clicked_comment_ids []uint

	// get all post related to the keywords in ascending order
	keywords := c.Params("keywords")
	if err := r.DB.Where("LOWER(title) LIKE LOWER(?)", "%"+strings.Replace(keywords, "%20", " ", -1)+"%").
		Order("ID").Find(&posts).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"err": "could not get posts"})
	}

	// get the user structure of the current user
	if err := r.DB.Select("id").Where("name = ?", c.Params("username")).First(&curUser).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"err": "could not get user"})
	}

	// get the list of posts and comments that are liked by the current users
	if err := r.getIdList(curUser.ID, "post", &clicked_post_ids); err != nil {
		return err
	}
	if err := r.getIdList(curUser.ID, "comment", &clicked_comment_ids); err != nil {
		return err
	}

	// get the list of posts in the structure needed by the frontend system
	for _, post := range posts {
		forumPost := frontend.Post{}
		if err := r.FillInForumPost(c, &forumPost, &post, &clicked_post_ids, &clicked_comment_ids); err != nil {
			return err
		}
		forumPosts = append(forumPosts, forumPost)
	}
	return c.Status(200).JSON(forumPosts)
}

// create a new post
func (r *Respository) CreatePost(c *fiber.Ctx, userId uint) error {

	newPost := &backend.Post{}
	newPost.UserID = userId

	// parse the data from frontend system to the backend `Post` structure
	if err := c.BodyParser(newPost); err != nil {
		return err
	}

	// send the new post to the database
	if err := r.DB.Create(newPost).Error; err != nil {
		return c.Status(400).JSON(fiber.Map{"err": "could not create new post"})
	}
	return c.Status(200).JSON(newPost)
}

// create a new comment
func (r *Respository) CreateComment(c *fiber.Ctx, userId uint) error {

	newComment := &backend.Comment{}
	newComment.UserID = userId

	// parse the data from frontend system to the backend `Comment` structure
	if err := c.BodyParser(newComment); err != nil {
		return err
	}

	// send the comment to the database
	if err := r.DB.Create(newComment).Error; err != nil {
		return c.Status(400).JSON(fiber.Map{"err": "could not create new comment"})
	}
	return c.Status(200).JSON(newComment)
}

// create a new post or comment
func (r *Respository) CreateItem(c *fiber.Ctx) error {

	itemType := &backend.ItemType{}
	user := &models.User{}
	username := c.Params("username")

	// parse the data from frontend system to the backend `ItemType` structure
	if err := c.BodyParser(itemType); err != nil {
		return err
	}

	// get the user using the username from the database
	if err := r.DB.Where("name = ?", username).First(user).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"err": "could not find user"})
	}

	// create a new post if the item is a post, else create a new comment
	if itemType.Type == "post" {
		return r.CreatePost(c, user.ID)
	}
	return r.CreateComment(c, user.ID)
}

// make changes to the content of the post or comment (only can be done by the creator of the item)
func (r *Respository) PutItem(c *fiber.Ctx) error {

	item := &backend.ItemType{}

	// parse the data from frontend system to the backend `ItemType` structure
	if err := c.BodyParser(item); err != nil {
		return err
	}

	if item.Type == "post" {
		post := &models.Post{}

		// update the target post with the new title
		if err := r.DB.Model(post).Where("id = ?", item.ID).Update("title", item.Content).Error; err != nil {
			return c.Status(400).JSON(fiber.Map{"err": "cannot update post title"})
		}
	} else {
		comment := &models.Comment{}

		// update the target comment with the new content
		if err := r.DB.Model(comment).Where("id = ?", item.ID).Update("content", item.Content).Error; err != nil {
			return c.Status(400).JSON(fiber.Map{"err": "cannot update comment content"})
		}
	}
	return c.Status(200).JSON(fiber.Map{"msg": "content is updated"})
}

// keep track of the item (post or comment) that are liked by users
// it will toggle between `liked` and `not liked` every time the like button was clicked
func (r *Respository) PatchItem(c *fiber.Ctx) error {

	item := &backend.ItemType{}
	user := &models.User{}
	username := c.Params("username")
	postId, _ := strconv.Atoi(c.Params("id"))

	// parse the data from frontend to the `ItemType` backend structure
	if err := c.BodyParser(item); err != nil {
		return err
	}

	// get the user with the username
	if err := r.DB.Where("name = ?", username).First(user).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"err": "could not find user"})
	}

	// update the number of like of post or comment
	if item.Type == "post" {
		if err := r.DB.Model(&models.Post{}).Where("id = ?", postId).Update("like", item.Like).Error; err != nil {
			return c.Status(400).JSON(fiber.Map{"err": "cannot update post's like"})
		}
	} else {
		if err := r.DB.Model(&models.Comment{}).Where("id = ?", item.ID).Update("like", item.Like).Error; err != nil {
			return c.Status(400).JSON(fiber.Map{"err": "cannot update comment's like"})
		}
	}

	// item.Content is true if the `like` was clicked previously, thus the likedItem needed to be deleted from the database
	// item.Content is false if the `like` was not clicked previously, thus the likedItem needed to add to the database
	if item.Content == "true" {
		var id uint
		if item.Type == "post" {
			id = uint(postId)
		} else {
			id = item.ID
		}
		if err := r.DB.Where(fmt.Sprintf("%s_id = ? AND user_id = ?", item.Type), id, user.ID).Delete(&models.LikedItem{}).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"err": "cannot delete liked item"})
		}
	} else {
		newLikedItem := &backend.LikedItem{}
		newLikedItem.UserID = user.ID
		newLikedItem.PostID = uint(postId)
		newLikedItem.IsPost = item.Type == "post"
		newLikedItem.CommentID = item.ID
		if err := r.DB.Create(newLikedItem).Error; err != nil {
			return c.Status(400).JSON(fiber.Map{"err": "cannot create new liked item"})
		}
	}
	return c.Status(200).JSON(fiber.Map{"msg": fmt.Sprintf("%s's click is updated", item.Type)})
}

// delete the selected post or comment (only can be done by the creator of the item)
func (r *Respository) DeleteItem(c *fiber.Ctx) error {

	post := &models.Post{}
	comment := &models.Comment{}
	likedItem := &models.LikedItem{}
	itemType := c.Params("type")
	itemId := c.Params("id")

	// delete every data related to the item (post or comment) from database
	if itemType == "post" {
		// delete the post
		if err := r.DB.Delete(post, itemId).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"err": "could not delete post"})
		}

		// delete the comment of the post
		if err := r.DB.Where("post_id = ?", itemId).Delete(comment).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"err": "could not delete comment"})
		}

		// delete the likedItem of the post and its comment
		if err := r.DB.Where("post_id = ?", itemId).Delete(likedItem).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"err": "could not delete liked post and comment"})
		}
	} else {
		// delete the comment
		if err := r.DB.Delete(comment, itemId).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"err": "could not delete comment"})
		}

		// delete the likedItem of the post
		if err := r.DB.Where("comment_id = ?", itemId).Delete(likedItem).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"err": "could not delete liked comment"})
		}
	}
	return c.Status(200).JSON(fiber.Map{"msg": "post is deleted"})
}

// set up the route of the app
func (r *Respository) SetupRoutes(app *fiber.App) {
	app.Post("/login", r.CreateUser)
	app.Get("/forum/:username", r.GetForumPosts)
	app.Get("/forum/:username/:keywords", r.GetForumPosts)
	app.Post("/forum/:username", r.CreateItem)
	app.Put("/forum/:username", r.PutItem)
	app.Patch("/forum/:username/:id", r.PatchItem)
	app.Delete("/forum/:username/:type/:id", r.DeleteItem)
}

func main() {

	// load `.env` file
	if err := godotenv.Load(".env"); err != nil {
		log.Fatal("Cannot load env")
	}

	// connect database
	config := &storage.Config{
		Host:     os.Getenv("DB_HOST"),
		Port:     os.Getenv("DB_PORT"),
		Password: os.Getenv("DB_PASS"),
		User:     os.Getenv("DB_USER"),
		DBname:   os.Getenv("DB_NAME"),
		SSLMode:  os.Getenv("DB_SSLMODE"),
	}
	db, err := storage.NewConnection(config)
	if err != nil {
		log.Fatal("Cannot load database")
	}

	if err = models.MigrateItems(db); err != nil {
		log.Fatal("Cannot migrate database")
	}

	// create a respository that contain the database
	r := Respository{
		DB: db,
	}

	// initialise the app
	app := fiber.New()

	// connect to the frontend system
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",
		AllowHeaders: "Origin,Content-Type,Accept",
	}))
	r.SetupRoutes(app)

	// listen to port 9090
	app.Listen(fmt.Sprintf(":%s", os.Getenv("PORT")))
}
