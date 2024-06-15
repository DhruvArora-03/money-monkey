package auth

import (
	"encoding/json"
	"fmt"
	"money-monkey/api/db"
	"money-monkey/api/types/dto"

	"net/http"

	"github.com/go-playground/validator/v10"
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
		http.Error(w, "Broken request body", http.StatusBadRequest)
		return
	}

	validate := validator.New()
	err = validate.Struct(request)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	id, err := checkPassword(request.Username, request.Password)
	if err != nil {
		fmt.Println(err.Error())
		http.Error(w, "Unable to verify password", http.StatusInternalServerError)
		return
	} else if id < 0 {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	token, err := generateJWT(id)
	if err != nil {
		fmt.Println(id)
		fmt.Println(err.Error())
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	response := dto.AuthResponse{
		Token: token,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func register(w http.ResponseWriter, r *http.Request) {
	var request dto.RegisterRequest

	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	validate := validator.New()
	err = validate.Struct(request)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	salt, err := generateSalt()
	if err != nil {
		http.Error(w, "Unable to generate new password salt", http.StatusInternalServerError)
		return
	}

	pass, err := hashPassword(request.Password, salt)
	if err != nil {
		http.Error(w, "Unable to hash password with salt", http.StatusInternalServerError)
		return
	}

	id, err := db.AddNewUser(request.FirstName, request.LastName, request.Username, pass, salt)
	if err != nil {
		http.Error(w, "Unable to register user", http.StatusInternalServerError)
		return
	}

	token, err := generateJWT(id)
	if err != nil {
		fmt.Println(id)
		fmt.Println(err.Error())
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	response := dto.AuthResponse{
		Token: token,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
