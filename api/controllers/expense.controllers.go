package controllers

import "net/http"

func newExpenseRouter() http.Handler {
	router := http.NewServeMux()
	return router
}
