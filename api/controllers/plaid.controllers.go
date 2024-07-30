package controllers

import (
	"encoding/json"
	"money-monkey/api/services"
	"money-monkey/api/utils"
	"net/http"
	"strconv"
)

func newPlaidRouter() http.Handler {
	router := http.NewServeMux()

	router.HandleFunc("GET /plaid/create-link-token/{user_id}", createLinkToken)
	router.HandleFunc("POST /plaid/generate-access-token", generateAccessToken)
	router.HandleFunc("GET /plaid/transactions/{plaid_connection_id}", fetchTransactions)

	return router
}

func createLinkToken(w http.ResponseWriter, r *http.Request) {
	userId := r.PathValue("user_id")
	if userId == "" {
		http.Error(w, ErrParseIdFromPath.Error(), http.StatusBadRequest)
		return
	}

	linkToken, err := services.CreateLinkToken(r.Context(), userId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(struct {
		LinkToken string `json:"link_token"`
	}{LinkToken: linkToken})
}

func generateAccessToken(w http.ResponseWriter, r *http.Request) {
	var request struct {
		UserId      string `json:"userId" validate:"required"`
		PublicToken string `json:"publicToken" validate:"required"`
	}

	err := utils.ValidateRequestBody(r.Body, &request)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	services.GenerateAccessToken(r.Context(), request.UserId, request.PublicToken)
}

func fetchTransactions(w http.ResponseWriter, r *http.Request) {
	plaidConnectionId, err := strconv.Atoi(r.PathValue("plaid_connection_id"))
	if err != nil {
		http.Error(w, ErrParseIdFromPath.Error(), http.StatusBadRequest)
	}

	res, err := services.FetchTransactions(r.Context(), plaidConnectionId)
	if err != nil {
		var errorCode = http.StatusInternalServerError
		if err == services.ErrInvalidPlaidConnectionId {
			errorCode = http.StatusBadRequest
		}

		http.Error(w, err.Error(), errorCode)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}
