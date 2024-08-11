package main

import (
	"context"
	"log"
	"money-monkey/api/controllers"
	"money-monkey/api/db"
	"money-monkey/api/services"
	"net/http"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error when loading environment variables from .env file %v", err)
	}

	dbpool := db.StartConnectionPool(context.Background())
	defer dbpool.Close()

	services.InitializePlaid()

	log.Println("API: Initialization Successful! Hosting on port 8080")
	http.ListenAndServe(":8080", controllers.CreateRouteHandler())
}
