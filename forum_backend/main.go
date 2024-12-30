package main

import (
	"fmt"
	"forum_backend/models"
	"forum_backend/storage"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"gorm.io/gorm"
)

type Respository struct {
	DB *gorm.DB
}

type User struct {
	Name string `json:"name"`
}

type Comment struct {
	Content string `json:"content"`
	Like    uint   `json:"like"`
	UserID  uint   `json:"userId"`
	PostID  uint   `json:"postId"`
}

type Post struct {
	Title  string `json:"title"`
	Like   uint   `json:"like"`
	UserID uint   `json:"userId"`
}

type ItemType struct {
	IsPost bool `json:"isPost"`
}

type ForumComment struct {
	ID      uint   `json:"id"`
	Content string `json:"content"`
	Like    uint   `json:"like"`
	User    string `json:"user"`
	Clicked bool   `json:"clicked"`
}

type ForumPost struct {
	ID       uint           `json:"id"`
	Title    string         `json:"title"`
	Like     uint           `json:"like"`
	User     string         `json:"user"`
	Clicked  bool           `json:"clicked"`
	Comments []ForumComment `json:"comments"`
}

func (r *Respository) CreateUser(c *fiber.Ctx) error {
	var count int64
	user := &User{}
	if err := c.BodyParser(user); err != nil {
		return err
	}
	if err := r.DB.Model(&models.User{}).Where("name = ?", user.Name).Count(&count).Error; err != nil {
		c.Status(404).JSON(fiber.Map{"err": "could not get the count of user"})
	}
	if count == 0 {
		newUser := &User{}
		newUser.Name = user.Name
		if err := r.DB.Create(newUser).Error; err != nil {
			c.Status(404).JSON(fiber.Map{"err": "could not create new user"})
		}
	}
	return c.Status(200).JSON(user)
}

func (r *Respository) FillInForumPost(c *fiber.Ctx, fp *ForumPost, p *models.Post) error {
	fp.ID = p.ID
	fp.Title = p.Title
	fp.Like = p.Like
	fp.Clicked = false
	user := &models.User{}
	if err := r.DB.First(user, p.UserID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"err": "could not get user"})
	}
	fp.User = user.Name
	comments := []models.Comment{}
	if err := r.DB.Where("post_id = ?", p.ID).Order("ID").Find(&comments).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"err": "could not get post's comments"})
	}
	forumComments := []ForumComment{}
	for _, comment := range comments {
		forumComment := ForumComment{}
		if err := r.FillInForumComment(c, &forumComment, &comment); err != nil {
			return err
		}
		forumComments = append(forumComments, forumComment)
	}
	fp.Comments = forumComments
	return nil
}

func (r *Respository) FillInForumComment(c *fiber.Ctx, fc *ForumComment, cm *models.Comment) error {
	fc.ID = cm.ID
	fc.Content = cm.Content
	fc.Like = cm.Like
	fc.Clicked = false
	user := &models.User{}
	if err := r.DB.First(user, cm.UserID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"err": "could not get comment's user"})
	}
	fc.User = user.Name
	return nil
}

func (r *Respository) GetForumPosts(c *fiber.Ctx) error {
	posts := []models.Post{}
	forumPosts := []ForumPost{}
	if err := r.DB.Order("ID").Find(&posts).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"err": "could not get posts"})
	}
	for _, post := range posts {
		forumPost := ForumPost{}
		if err := r.FillInForumPost(c, &forumPost, &post); err != nil {
			return err
		}
		forumPosts = append(forumPosts, forumPost)
	}
	return c.Status(200).JSON(forumPosts)
}

func (r *Respository) CreatePost(c *fiber.Ctx, userId uint) error {
	newPost := &Post{}
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
	newComment := &Comment{}
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
	itemType := &ItemType{}
	username := c.Params("username")
	user := &models.User{}
	if err := c.BodyParser(itemType); err != nil {
		return err
	}
	if err := r.DB.Where("name = ?", username).First(user).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"err": "could not find user"})
	}
	if itemType.IsPost {
		return r.CreatePost(c, user.ID)
	}
	return r.CreateComment(c, user.ID)
}

func (r *Respository) SetupRoutes(app *fiber.App) {
	app.Post("/login", r.CreateUser)
	app.Get("/forum/:username", r.GetForumPosts)
	app.Post("/forum/:username", r.CreateItem)
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
