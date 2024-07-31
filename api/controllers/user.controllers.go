package controllers

import (
	"fmt"
	"money-monkey/api/services"
	"money-monkey/api/utils"
	"net/http"
)

func newUserRouter() http.Handler {
	router := http.NewServeMux()

	router.HandleFunc("POST /users/create", createUser)

	return router
}

func createUser(w http.ResponseWriter, r *http.Request) {
	var request struct {
		UserId string `json:"userId"`
	}

	err := utils.ValidateRequestBody(r.Body, &request)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = services.CreateUser(r.Context(), request.UserId)
	if err != nil {
		http.Error(w, fmt.Errorf("Unable to create user %w", err).Error(), http.StatusInternalServerError)
		return
	}
}
