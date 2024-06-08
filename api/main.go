package main

import (
	"fmt"
	"money-monkey/api/middleware"
	"money-monkey/api/plaid"
	"net/http"
)


func main() {
	router := http.NewServeMux()

	router.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) { })

	plaid.Init()
	plaidRouter := plaid.NewRouter()
	router.Handle("/plaid/", plaidRouter)

	fmt.Println("API Initialization Successful! Hosting on port 8080");
	http.ListenAndServe(":8080", middleware.Logging(router))
}