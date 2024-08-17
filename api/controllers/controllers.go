package controllers

import (
	"errors"
	"money-monkey/api/db"
	"money-monkey/api/utils"
	"net/http"
)

var ErrParseIdFromPath = errors.New("invalid request URL, unable to read id from path")

func CreateRouteHandler() http.Handler {
	router := http.NewServeMux()

	router.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		if db.IsHealthy(r.Context()) {
			w.WriteHeader(http.StatusOK)
		} else {
			w.WriteHeader(http.StatusInternalServerError)
		}
	})

	router.Handle("/plaid/", newPlaidRouter())
	router.Handle("/expenses/", newExpenseRouter())
	router.Handle("/categories/", newCategoriesRouter())
	router.Handle("/users/", newUserRouter())

	return utils.LoggingMiddleware(router)
}
