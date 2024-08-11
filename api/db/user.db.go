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

var default_categories = [...]string{
	"Housing",
	"Groceries",
	"Food",
	"Transportation",
	"Entertainment",
	"Necessities",
	"Clothes",
	"Other",
}

func AddNewUser(ctx context.Context, userId string) error {
	var existing_categories []string
	rows, err := dbpool.Query(ctx, "SELECT c.name FROM category c WHERE c.user_id = @user_id", pgx.NamedArgs{"user_id": userId})
	if err != nil {
		return err
	}
	err = pgxscan.ScanAll(&existing_categories, rows)
	if err != nil {
		return err
	}

	const query = "INSERT INTO category (user_id, name) VALUES (@user_id, @category)"

	batch := &pgx.Batch{}
	for _, category := range default_categories {
		if !utils.Contains(existing_categories, category) {
			batch.Queue(query, pgx.NamedArgs{"user_id": userId, "category": category})
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
