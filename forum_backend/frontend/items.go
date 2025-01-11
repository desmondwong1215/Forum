package frontend

type Comment struct {
	ID      uint   `json:"id"`
	Year    string `json:"year"`
	Month   string `json:"month"`
	Day     string `json:"day"`
	Content string `json:"content"`
	Like    uint   `json:"like"`
	User    string `json:"user"`
	Clicked bool   `json:"clicked"`
}

type Post struct {
	ID       uint      `json:"id"`
	Year     string    `json:"year"`
	Month    string    `json:"month"`
	Day      string    `json:"day"`
	Title    string    `json:"title"`
	Content  string    `json:"content"`
	Like     uint      `json:"like"`
	User     string    `json:"user"`
	Clicked  bool      `json:"clicked"`
	Comments []Comment `json:"comments"`
}
