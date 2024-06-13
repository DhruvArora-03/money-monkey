package dto

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token     string `json:"token"`
}

type RegisterRequest struct {
    FirstName string    `json:"first_name"`
    LastName  string    `json:"last_name"`
    Username  string    `json:"username"`
    Password  string    `json:"password"`
}