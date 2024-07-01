package auth

import (
	"encoding/json"
	"log"
	"money-monkey/api/db"
	"money-monkey/api/types"
	"strconv"

	"net/http"

	"github.com/go-playground/validator/v10"
)

func NewRouter() http.Handler {
	router := http.NewServeMux()

	router.HandleFunc("POST /auth/register", register)
	router.HandleFunc("POST /auth/login", login)

	router.HandleFunc("GET /auth/verify", func(w http.ResponseWriter, r *http.Request) {
		claims, err := ExtractClaims(r)
		if err != nil {
			status := http.StatusBadRequest
			if err == ErrExpiredToken {
				status = http.StatusUnauthorized
			}
			log.Println(err.Error())
			http.Error(w, err.Error(), status)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte(strconv.Itoa(claims.UserId)))
	})

	return router
}

func login(w http.ResponseWriter, r *http.Request) {
	var request types.LoginRequest

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

	id, err := checkPassword(r.Context(), request.Username, request.Password)
	if err == errIncorrectLogin || err == errUserNotFound {
		log.Println(err.Error())
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	} else if err != nil {
		log.Println(err.Error())
		http.Error(w, "Unable to verify password", http.StatusInternalServerError)
		return
	}

	tokens, err := generateTokens(id)
	if err != nil {
		http.Error(w, "Error generating tokens", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(tokens)
}

func register(w http.ResponseWriter, r *http.Request) {
	var request types.RegisterRequest

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

	exists, err := db.CheckIfUserExists(r.Context(), request.Username)
	if err != nil {
		http.Error(w, "Could not check if username already exists", http.StatusInternalServerError)
	} else if exists {
		http.Error(w, "Username already exists", http.StatusBadRequest)
		return
	}

	id, err := db.AddNewUser(r.Context(), request.FirstName, request.LastName, request.Username, pass, salt)
	if err != nil {
		http.Error(w, "Unable to register user", http.StatusInternalServerError)
		return
	}

	tokens, err := generateTokens(id)
	if err != nil {
		http.Error(w, "Error generating tokens", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(tokens)
}
