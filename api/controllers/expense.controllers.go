package controllers

import (
	"encoding/json"
	"fmt"
	"money-monkey/api/services"
	"money-monkey/api/types"
	"money-monkey/api/utils"
	"net/http"
)

func newExpenseRouter() http.Handler {
	router := http.NewServeMux()

	router.HandleFunc("GET /expenses/", getExpenses)
	router.HandleFunc("POST /expenses/new", createExpense)
	router.HandleFunc("POST /expenses/import", importPlaidExpense)

	return utils.UserIdMiddleware(router)
}

func getExpenses(w http.ResponseWriter, r *http.Request) {
	expenses, err := services.GetExpenses(r.Context())
	if err != nil {
		http.Error(w, fmt.Errorf("unable to get expenses %w", err).Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(expenses)
}

func createExpense(w http.ResponseWriter, r *http.Request) {
	var request types.ExpensePartial

	err := utils.ValidateRequestBody(r.Body, &request)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = services.CreateExpense(r.Context(), &request)
	if err != nil {
		http.Error(w, fmt.Errorf("unable to create expense %w", err).Error(), http.StatusInternalServerError)
		return
	}
}

func importPlaidExpense(w http.ResponseWriter, r *http.Request) {
	var request struct {
		PlaidTransactionId int `json:"plaid_transaction_id" validate:"required"`
		CategoryId         int `json:"category_id" validate:"required"`
	}

	err := utils.ValidateRequestBody(r.Body, &request)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = services.ImportPlaidExpense(r.Context(), request.PlaidTransactionId, request.CategoryId)
	if err != nil {
		http.Error(w, fmt.Errorf("unable to import plaid expense %w", err).Error(), http.StatusInternalServerError)
		return
	}
}
