package db

import (
	"context"
	"money-monkey/api/types"
	"money-monkey/api/utils"

	"github.com/georgysavva/scany/v2/pgxscan"
	"github.com/jackc/pgx/v5"
)

func GetCategories(ctx context.Context) (categories *[]types.Category, err error) {
	rows, err := dbpool.Query(ctx, `
		SELECT id, name
		FROM category
		WHERE user_id = @user_id`,
		pgx.NamedArgs{"user_id": utils.GetUserId(ctx)})
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	categories = &[]types.Category{}
	err = pgxscan.ScanAll(categories, rows)
	if err != nil {
		return nil, err
	}
	if rows.Err() != nil {
		return nil, rows.Err()
	}

	return categories, nil
}
