package models

import (
	"gorm.io/gorm"
)

type User struct {
	ID   uint   `gorm:"primary key;autoIncrement" json:"id"`
	Name string `json:"name"`
}

type Comment struct {
	ID      uint   `gorm:"primary key;autoIncrement" json:"id"`
	Content string `json:"content"`
	Like    uint   `json:"like"`
	UserID  uint   `json:"userId"`
	PostID  uint   `json:"postId"`
}

type Post struct {
	ID     uint   `gorm:"primary key;autoIncrement" json:"id"`
	Title  string `json:"title"`
	Like   uint   `json:"like"`
	UserID uint   `json:"userId"`
}

// type LikedPost struct {
// 	ID uint `gorm:"primary key;autoIncrement" json:"id"`
// 	// User User `gorm:"foreignKey:UserID;references:ID" json:"user"`
// 	User User ` json:"user"`
// 	// UserID uint `json:"-"`
// 	PostID uint `json:"postId"`
// }

// type LikedComment struct {
// 	ID uint `gorm:"primary key;autoIncrement" json:"id"`
// 	// User User `gorm:"foreignKey:UserID;references:ID" json:"user"`
// 	User User ` json:"user"`
// 	// UserID    uint `json:"-"`
// 	CommentID uint `json:"commentId"`
// }

func MigrateItems(db *gorm.DB) error {
	// err := db.AutoMigrate(&Post{}, &Comment{}, &LikedPost{}, &LikedComment{}, &User{})
	err := db.AutoMigrate(&User{}, &Post{}, &Comment{})
	return err
}
