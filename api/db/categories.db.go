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
		SELECT id, name, color
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

func GetYearCategorySums(ctx context.Context, year int) (categorySums *[]types.CategorySum, err error) {
	rows, err := dbpool.Query(ctx, `
		SELECT
			c.id as category_id,
			c.name,
			c.color,
			SUM(COALESCE(cm.total_cents, 0)) AS total_cents
		FROM category c
		LEFT JOIN (
			SELECT *
			FROM category_month cm
			WHERE cm.year = @year
		) cm ON cm.category_id = c.id
		WHERE c.user_id = @user_id
		GROUP BY c.id
		ORDER BY total_cents DESC`,
		pgx.NamedArgs{"user_id": utils.GetUserId(ctx), "year": year})
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	categorySums = &[]types.CategorySum{}
	err = pgxscan.ScanAll(categorySums, rows)
	if err != nil {
		return nil, err
	}
	if rows.Err() != nil {
		return nil, rows.Err()
	}

	return categorySums, nil
}

func GetMonthCategorySums(ctx context.Context, year, month int) (categorySums *[]types.CategorySum, err error) {
	rows, err := dbpool.Query(ctx, `
		SELECT
			c.id as category_id,
			c.name,
			c.color,
			SUM(COALESCE(cm.total_cents, 0)) AS total_cents
		FROM category c
		LEFT JOIN (
			SELECT *
			FROM category_month cm
			WHERE cm.year = @year AND cm.month = @month
		) cm ON cm.category_id = c.id
		WHERE c.user_id = @user_id
		GROUP BY c.id
		ORDER BY total_cents DESC`,
		pgx.NamedArgs{"user_id": utils.GetUserId(ctx), "year": year, "month": month})
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	categorySums = &[]types.CategorySum{}
	err = pgxscan.ScanAll(categorySums, rows)
	if err != nil {
		return nil, err
	}
	if rows.Err() != nil {
		return nil, rows.Err()
	}

	return categorySums, nil
}
