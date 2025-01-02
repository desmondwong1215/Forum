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

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"gorm.io/gorm"
)

type Respository struct {
	DB *gorm.DB
}

func (r *Respository) CreateUser(c *fiber.Ctx) error {
	var count int64
	user := &backend.User{}
	if err := c.BodyParser(user); err != nil {
		return err
	}
	if err := r.DB.Model(&models.User{}).Where("name = ?", user.Name).Count(&count).Error; err != nil {
		c.Status(404).JSON(fiber.Map{"err": "could not get the count of user"})
	}
	if count == 0 {
		newUser := &backend.User{}
		newUser.Name = user.Name
		if err := r.DB.Create(newUser).Error; err != nil {
			c.Status(404).JSON(fiber.Map{"err": "could not create new user"})
		}
	}
	return c.Status(200).JSON(user)
}

func (r *Respository) ClickedByCurUser(id uint, userId uint, itemType string) bool {
	var count int64
	if err := r.DB.Model(&models.LikedItem{}).
		Where(fmt.Sprintf("%s_id = ? AND user_id = ? AND is_post = ?", itemType), id, userId, itemType == "post").
		Count(&count).Error; err != nil {
		return false
	}
	return count == 1
}

func (r *Respository) FillInForumPost(c *fiber.Ctx, fp *frontend.Post, p *models.Post) error {
	fp.ID = p.ID
	fp.Title = p.Title
	fp.Like = p.Like
	creator := &models.User{}
	curUser := &models.User{}
	if err := r.DB.First(curUser, "name = ?", c.Params("username")).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"err": "could not get user"})
	}
	fp.Clicked = r.ClickedByCurUser(p.ID, curUser.ID, "post")
	if err := r.DB.First(creator, p.UserID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"err": "could not get user"})
	}
	fp.User = creator.Name
	comments := []models.Comment{}
	if err := r.DB.Where("post_id = ?", p.ID).Order("ID").Find(&comments).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"err": "could not get post's comments"})
	}
	forumComments := []frontend.Comment{}
	for _, comment := range comments {
		forumComment := frontend.Comment{}
		if err := r.FillInForumComment(c, &forumComment, &comment, curUser.ID); err != nil {
			return err
		}
		forumComments = append(forumComments, forumComment)
	}
	fp.Comments = forumComments
	return nil
}

func (r *Respository) FillInForumComment(c *fiber.Ctx, fc *frontend.Comment, cm *models.Comment, curUserID uint) error {
	fc.ID = cm.ID
	fc.Content = cm.Content
	fc.Like = cm.Like
	user := &models.User{}
	fc.Clicked = r.ClickedByCurUser(cm.ID, curUserID, "comment")
	if err := r.DB.First(user, cm.UserID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"err": "could not get comment's user"})
	}
	fc.User = user.Name
	return nil
}

func (r *Respository) GetForumPosts(c *fiber.Ctx) error {
	posts := []models.Post{}
	forumPosts := []frontend.Post{}
	if err := r.DB.Order("ID").Find(&posts).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"err": "could not get posts"})
	}
	for _, post := range posts {
		forumPost := frontend.Post{}
		if err := r.FillInForumPost(c, &forumPost, &post); err != nil {
			return err
		}
		forumPosts = append(forumPosts, forumPost)
	}
	return c.Status(200).JSON(forumPosts)
}

func (r *Respository) CreatePost(c *fiber.Ctx, userId uint) error {
	newPost := &backend.Post{}
	newPost.UserID = userId
	if err := c.BodyParser(newPost); err != nil {
		return err
	}
	if err := r.DB.Create(newPost).Error; err != nil {
		return c.Status(400).JSON(fiber.Map{"err": "could not create new post"})
	}
	return c.Status(200).JSON(newPost)
}

func (r *Respository) CreateComment(c *fiber.Ctx, userId uint) error {
	newComment := &backend.Comment{}
	newComment.UserID = userId
	if err := c.BodyParser(newComment); err != nil {
		return err
	}
	if err := r.DB.Create(newComment).Error; err != nil {
		return c.Status(400).JSON(fiber.Map{"err": "could not create new comment"})
	}
	return c.Status(200).JSON(newComment)
}

func (r *Respository) CreateItem(c *fiber.Ctx) error {
	itemType := &backend.ItemType{}
	username := c.Params("username")
	user := &models.User{}
	if err := c.BodyParser(itemType); err != nil {
		return err
	}
	if err := r.DB.Where("name = ?", username).First(user).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"err": "could not find user"})
	}
	if itemType.Type == "post" {
		return r.CreatePost(c, user.ID)
	}
	return r.CreateComment(c, user.ID)
}

func (r *Respository) PutItem(c *fiber.Ctx) error {
	item := &backend.ItemType{}
	if err := c.BodyParser(item); err != nil {
		return err
	}
	if item.Type == "post" {
		post := &models.Post{}
		if err := r.DB.Model(post).Where("id = ?", item.ID).Update("title", item.Content).Error; err != nil {
			return c.Status(400).JSON(fiber.Map{"err": "cannot update post title"})
		}
	} else {
		comment := &models.Comment{}
		if err := r.DB.Model(comment).Where("id = ?", item.ID).Update("content", item.Content).Error; err != nil {
			return c.Status(400).JSON(fiber.Map{"err": "cannot update comment content"})
		}
	}
	return c.Status(200).JSON(fiber.Map{"msg": "content is updated"})
}

func (r *Respository) PatchItem(c *fiber.Ctx) error {
	item := &backend.ItemType{}
	username := c.Params("username")
	postId, _ := strconv.Atoi(c.Params("id"))
	user := &models.User{}
	if err := c.BodyParser(item); err != nil {
		return err
	}
	if err := r.DB.Where("name = ?", username).First(user).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"err": "could not find user"})
	}
	if item.Type == "post" {
		if err := r.DB.Model(&models.Post{}).Where("id = ?", postId).Update("like", item.Like).Error; err != nil {
			return c.Status(400).JSON(fiber.Map{"err": "cannot update post's like"})
		}
	} else {
		if err := r.DB.Model(&models.Comment{}).Where("id = ?", item.ID).Update("like", item.Like).Error; err != nil {
			return c.Status(400).JSON(fiber.Map{"err": "cannot update comment's like"})
		}
	}
	if item.Content == "true" {
		var id uint
		if item.Type == "post" {
			id = uint(postId)
		} else {
			id = item.ID
		}
		if err := r.DB.Where(fmt.Sprintf("%s_id = ?", item.Type), id).Delete(&models.LikedItem{}).Error; err != nil {
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

func (r *Respository) DeleteItem(c *fiber.Ctx) error {
	post := &models.Post{}
	comment := &models.Comment{}
	likedItem := &models.LikedItem{}
	itemType := c.Params("type")
	itemId := c.Params("id")
	if itemType == "post" {
		if err := r.DB.Delete(post, itemId).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"err": "could not delete post"})
		}
		if err := r.DB.Where("post_id = ?", itemId).Delete(comment).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"err": "could not delete comment"})
		}
		if err := r.DB.Where("post_id = ?", itemId).Delete(likedItem).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"err": "could not delete liked post and comment"})
		}
	} else {
		if err := r.DB.Delete(comment, itemId).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"err": "could not delete comment"})
		}
		if err := r.DB.Where("comment_id = ?", itemId).Delete(likedItem).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"err": "could not delete liked comment"})
		}
	}
	return c.Status(200).JSON(fiber.Map{"msg": "post is deleted"})
}

func (r *Respository) SetupRoutes(app *fiber.App) {
	app.Post("/login", r.CreateUser)
	app.Get("/forum/:username", r.GetForumPosts)
	app.Post("/forum/:username", r.CreateItem)
	app.Put("/forum/:username", r.PutItem)
	app.Patch("/forum/:username/:id", r.PatchItem)
	app.Delete("/forum/:username/:type/:id", r.DeleteItem)
}

func main() {
	if err := godotenv.Load(".env"); err != nil {
		log.Fatal("Cannot load env")
	}
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

	r := Respository{
		DB: db,
	}
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",
		AllowHeaders: "Origin,Content-Type,Accept",
	}))
	r.SetupRoutes(app)
	app.Listen(fmt.Sprintf(":%s", os.Getenv("PORT")))
}
