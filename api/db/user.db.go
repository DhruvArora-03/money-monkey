package db

import (
	"context"
	"fmt"
	"money-monkey/api/utils"

	"github.com/georgysavva/scany/v2/pgxscan"
	"github.com/jackc/pgx/v5"
)

var default_categories = [...]string{
	"Housing",
	"Groceries",
	"Food",
	"Transportation",
	"Entertainment",
	"Necessities",
	"Clothes",
}

func AddNewUser(ctx context.Context, userId string) error {
	var existing_categories []string
	rows, err := dbpool.Query(ctx, "SELECT c.name FROM category c WHERE c.user_id = @user_id", pgx.NamedArgs{"user_id": userId})
	if err != nil {
		return err
	}
	defer rows.Close()

	err = pgxscan.ScanAll(&existing_categories, rows)
	if err != nil {
		return err
	}
	if rows.Err() != nil {
		return rows.Err()
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
				return fmt.Errorf("unable to insert category: %w", err)
			}
		}
	}

	return err
}
