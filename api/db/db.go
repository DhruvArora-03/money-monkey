package db

import (
	"context"
	"log"
	"os"

	"github.com/georgysavva/scany/v2/pgxscan"
	"github.com/jackc/pgx/v5/pgxpool"
)

var dbpool *pgxpool.Pool

func StartConnectionPool(ctx context.Context) *pgxpool.Pool {
	cfg, err := pgxpool.ParseConfig(os.Getenv("DB_URL"))
	if err != nil {
		log.Fatalf("Error when parsing DB_URL from .env")
	}

	dbpool, err = pgxpool.NewWithConfig(ctx, cfg)
	if err != nil {
		log.Fatalf("Error when connecting to database: %v", err)
	}

	return dbpool
}

func IsHealthy(ctx context.Context) bool {
	if dbpool == nil {
		log.Fatal("Database connection pool is not initialized")
		return false
	}

	err := pgxscan.Get(ctx, dbpool, nil, "SELECT 1")

	if err != nil {
		log.Fatal("Database connection is not healthy")
		return false
	}

	return true

}
