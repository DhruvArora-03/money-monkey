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
	router.HandleFunc("GET /categories/sums/{year}", getYearCategorySums)
	router.HandleFunc("GET /categories/sums/{year}/{month}", getMonthCategorySums)

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

func getYearCategorySums(w http.ResponseWriter, r *http.Request) {
	year, err := strconv.Atoi(r.PathValue("year"))
	if err != nil {
		http.Error(w, fmt.Errorf("invalid year format %w", err).Error(), http.StatusBadRequest)
		return
	}

	categorySums, err := services.GetYearCategorySums(r.Context(), year)
	if err != nil {
		http.Error(w, fmt.Errorf("unable to get category sums %w", err).Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(categorySums)
}

func getMonthCategorySums(w http.ResponseWriter, r *http.Request) {
	year, err := strconv.Atoi(r.PathValue("year"))
	if err != nil {
		http.Error(w, fmt.Errorf("invalid year format %w", err).Error(), http.StatusBadRequest)
		return
	}

	month, err := strconv.Atoi(r.PathValue("month"))
	if err != nil {
		http.Error(w, fmt.Errorf("invalid month format %w", err).Error(), http.StatusBadRequest)
		return
	}

	categorySums, err := services.GetMonthCategorySums(r.Context(), year, month)
	if err != nil {
		http.Error(w, fmt.Errorf("unable to get category sums %w", err).Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(categorySums)
}
