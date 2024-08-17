package controllers

import (
	"encoding/json"
	"fmt"
	"money-monkey/api/services"
	"money-monkey/api/utils"
	"net/http"
)

func newCategoriesRouter() http.Handler {
	router := http.NewServeMux()

	router.HandleFunc("GET /categories/", getCategories)

	return utils.UserIdMiddleware(router)
}

func getCategories(w http.ResponseWriter, r *http.Request) {
	categories, err := services.GetCategories(r.Context())
	if err != nil {
		http.Error(w, fmt.Errorf("unable to get categories %w", err).Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(categories)
}
