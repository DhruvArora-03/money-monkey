package db

import (
	"context"
	"log"
	"os"

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
