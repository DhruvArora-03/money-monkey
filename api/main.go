package main

import (
	"log"
	"money-monkey/api/auth"
	"money-monkey/api/db"
	"money-monkey/api/middleware"
	"money-monkey/api/plaid"
	"net/http"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error when loading environment variables from .env file %v", err)
	}

	dbpool := db.StartConnectionPool()
	defer dbpool.Close()

	plaid.Initialize()
	auth.Initialize()

	router := http.NewServeMux()

	router.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {})

	router.Handle("/plaid/", plaid.NewRouter())
	router.Handle("/auth/", auth.NewRouter())

	log.Println("API Initialization Successful! Hosting on port 8080")
	http.ListenAndServe(":8080", middleware.Logging(router))
}
