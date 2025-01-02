package frontend

type Comment struct {
	ID      uint   `json:"id"`
	Content string `json:"content"`
	Like    uint   `json:"like"`
	User    string `json:"user"`
	Clicked bool   `json:"clicked"`
}

type Post struct {
	ID       uint      `json:"id"`
	Title    string    `json:"title"`
	Like     uint      `json:"like"`
	User     string    `json:"user"`
	Clicked  bool      `json:"clicked"`
	Comments []Comment `json:"comments"`
}
