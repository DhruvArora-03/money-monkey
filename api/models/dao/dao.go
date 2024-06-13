package dao

type AuthInfo struct {
	Id       int
	Password string
	Salt     string
}

type NewUser struct {
	FirstName string    `json:"first_name"`
    LastName  string    `json:"last_name"`
    Username  string    `json:"username"`
    Password  string    `json:"password"`
    Salt      string    `json:"salt"`
}