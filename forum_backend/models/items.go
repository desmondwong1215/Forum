package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID   uint   `gorm:"primary key;autoIncrement" json:"id"`
	Name string `json:"name"`
}

type Comment struct {
	ID        uint `gorm:"primary key;autoIncrement" json:"id"`
	CreatedAt time.Time
	Content   string `json:"content"`
	Like      uint   `json:"like"`
	UserID    uint   `json:"userId"`
	PostID    uint   `json:"postId"`
}

type Post struct {
	ID        uint `gorm:"primary key;autoIncrement" json:"id"`
	CreatedAt time.Time
	Title     string `json:"title"`
	Content   string `json:"content"`
	Like      uint   `json:"like"`
	UserID    uint   `json:"userId"`
}

type LikedItem struct {
	ID        uint `gorm:"primary key;autoIncrement" json:"id"`
	UserID    uint `json:"userId"`
	IsPost    bool `json:"isPost"`
	PostID    uint `json:"postId"`
	CommentID uint `json:"commentId"`
}

func MigrateItems(db *gorm.DB) error {
	err := db.AutoMigrate(&User{}, &Post{}, &Comment{}, &LikedItem{})
	return err
}
