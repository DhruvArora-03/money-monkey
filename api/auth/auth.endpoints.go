package auth

import (
	"encoding/json"
	"fmt"
	"money-monkey/api/models/dto"
	"net/http"
)

func NewRouter() http.Handler {
	router := http.NewServeMux()

	router.HandleFunc("POST /auth/register", register)
	router.HandleFunc("POST /auth/login", login)

	return router
}

func login(w http.ResponseWriter, r *http.Request) {
	var request dto.LoginRequest

	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	userId, err := checkPassword(request.Username, request.Password)
	if err != nil {
		http.Error(w, "internal issue", http.StatusInternalServerError)
		return
	} else if userId < 0 {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	token, err := generateJWT(userId)
	if err != nil {
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	response := dto.LoginResponse{
		Token: token,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func register(w http.ResponseWriter, r *http.Request) {
	fmt.Println("TEST")
}
