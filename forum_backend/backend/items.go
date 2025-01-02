package backend

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

type LikedItem struct {
	UserID    uint `json:"userId"`
	IsPost    bool `json:"isPost"`
	PostID    uint `json:"postId"`
	CommentID uint `json:"commentId"`
}

type ItemType struct {
	ID      uint   `json:"id"`
	Type    string `json:"type"`
	Content string `json:"content"`
	Like    uint   `json:"like"`
}
