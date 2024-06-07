package main

import (
	"money-monkey/api/plaid"
	"money-monkey/api/middleware"
	"net/http"
)


func main() {
	router := http.NewServeMux()

	router.HandleFunc("GET /hello-world", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello World!\n"))
	})

	plaid.Init()
	plaidRouter := plaid.NewRouter()
	router.Handle("/plaid/", plaidRouter)

	http.ListenAndServe(":8080", middleware.Logging(router))
}