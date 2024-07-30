package controllers

import (
	"errors"
	"net/http"
)

var ErrParseIdFromPath = errors.New("invalid request URL, unable to read id from path")

func CreateRouteHandler() http.Handler {
	router := http.NewServeMux()

	router.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {})

	router.Handle("/plaid/", newPlaidRouter())
	router.Handle("/expenses/", newExpenseRouter())
	router.Handle("/users/", newUserRouter())

	return router
}
