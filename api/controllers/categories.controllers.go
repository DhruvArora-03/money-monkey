package controllers

import (
	"encoding/json"
	"fmt"
	"money-monkey/api/services"
	"money-monkey/api/utils"
	"net/http"
	"strconv"
)

func newCategoriesRouter() http.Handler {
	router := http.NewServeMux()

	router.HandleFunc("GET /categories/", getCategories)
	router.HandleFunc("GET /categories/sums", getCategorySums)

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

func getCategorySums(w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()

	if !params.Has("year") {
		http.Error(w, "year is required", http.StatusBadRequest)
		return
	}
	year, err := strconv.Atoi(params.Get("year"))
	if err != nil {
		http.Error(w, fmt.Errorf("invalid year format %w", err).Error(), http.StatusBadRequest)
		return
	}

	if params.Has("month") {
		month, err := strconv.Atoi(params.Get("month"))
		if err != nil {
			http.Error(w, fmt.Errorf("invalid month format %w", err).Error(), http.StatusBadRequest)
			return
		}

		getMonthCategorySums(w, r, year, month)
		return
	}

	getYearCategorySums(w, r, year)
}

func getYearCategorySums(w http.ResponseWriter, r *http.Request, year int) {
	categorySums, err := services.GetYearCategorySums(r.Context(), year)
	if err != nil {
		http.Error(w, fmt.Errorf("unable to get category sums %w", err).Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(categorySums)
}

func getMonthCategorySums(w http.ResponseWriter, r *http.Request, year, month int) {
	categorySums, err := services.GetMonthCategorySums(r.Context(), year, month)
	if err != nil {
		http.Error(w, fmt.Errorf("unable to get category sums %w", err).Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(categorySums)
}
