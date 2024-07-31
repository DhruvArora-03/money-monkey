package db

import (
	"context"
	"errors"
	"fmt"
	"money-monkey/api/utils"

	"github.com/georgysavva/scany/v2/pgxscan"
	"github.com/jackc/pgerrcode"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

func AddNewUser(ctx context.Context, userId string) error {
	var default_categories []string
	rows, err := dbpool.Query(ctx, "SELECT c.name FROM category c")
	if err != nil {
		return err
	}
	err = pgxscan.ScanAll(&default_categories, rows)
	if err != nil {
		return err
	}

	var existing_categories []string
	rows, err = dbpool.Query(ctx, "SELECT uc.name FROM user_category uc WHERE uc.user_id = $1", userId)
	if err != nil {
		return err
	}
	err = pgxscan.ScanAll(&existing_categories, rows)
	if err != nil {
		return err
	}

	query := "INSERT INTO user_category (user_id, name) VALUES ($1, $2)"

	batch := &pgx.Batch{}
	for _, category := range default_categories {
		if !utils.Contains(existing_categories, category) {
			batch.Queue(query, userId, category)
		}
	}

	results := dbpool.SendBatch(ctx, batch)
	defer func() { err = results.Close() }()

	for _, category := range default_categories {
		if !utils.Contains(existing_categories, category) {
			_, err = results.Exec()
			if err != nil {
				var pgErr *pgconn.PgError
				if errors.As(err, &pgErr) && pgErr.Code == pgerrcode.UniqueViolation {
					continue
				}

				return fmt.Errorf("unable to insert category: %w", err)
			}
		}
	}

	return err
}
