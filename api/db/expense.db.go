package db

import (
	"context"
	"fmt"
	"money-monkey/api/types"
	"money-monkey/api/utils"
	"time"

	"github.com/georgysavva/scany/v2/pgxscan"
	"github.com/jackc/pgx/v5"
)

func GetExpenses(ctx context.Context) (expenses *[]types.Expense, err error) {
	rows, err := dbpool.Query(ctx, `
		SELECT
			e.id,
			e.name,
			e.date,
			e.amount_cents,
			c.name AS category_name
		FROM expense e 
		LEFT JOIN category c ON c.id = e.category_id
		WHERE e.user_id = @user_id
		ORDER BY e.date DESC`, pgx.NamedArgs{"user_id": utils.GetUserId(ctx)})
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	expenses = &[]types.Expense{}
	err = pgxscan.ScanAll(expenses, rows)
	if err != nil {
		return nil, err
	}
	if rows.Err() != nil {
		return nil, rows.Err()
	}

	return expenses, nil
}

func CreateExpense(ctx context.Context, expense *types.ExpensePartial) error {
	tx, err := dbpool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	_, err = tx.Exec(ctx, `
		INSERT INTO expense (user_id, name, amount_cents, date, category_id)
		VALUES (@user_id, @name, @amount_cents, @date, @category_id)`,
		pgx.NamedArgs{
			"user_id":      utils.GetUserId(ctx),
			"name":         expense.Name,
			"amount_cents": expense.AmountCents,
			"date":         expense.Date,
			"category_id":  expense.CategoryId,
		})
	if err != nil {
		return err
	}

	time, err := time.Parse("2006-01-02T15:04:05Z", expense.Date)
	if err != nil {
		return fmt.Errorf("could not parse date: %v", err)
	}
	args := pgx.NamedArgs{
		"expense_amount": expense.AmountCents,
		"category_id":    expense.CategoryId,
		"year":           time.Year(),
		"month":          time.Month(),
	}

	res, err := tx.Exec(ctx, `
		UPDATE category_month
		SET total_cents = total_cents + @expense_amount
		WHERE category_id = @category_id AND year = @year AND month = @month`, args)
	if err != nil {
		return err
	}

	if res.RowsAffected() == 0 {
		_, err = tx.Exec(ctx, `
			INSERT INTO category_month (category_id, year, month, total_cents)
			VALUES (@category_id, @year, @month, @expense_amount)`, args)
		if err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}

func ImportPlaidExpense(ctx context.Context, plaidTransactionId, categoryId int) error {
	var expense types.ExpensePartial

	err := pgxscan.Get(ctx, dbpool, &expense, `
			SELECT pt.name, pt.amount_cents, pt.date
			FROM plaid_transaction pt
			WHERE pt.id = @plaid_transaction_id`,
		pgx.NamedArgs{"plaid_transaction_id": plaidTransactionId})

	if err != nil {
		return err
	}

	return CreateExpense(ctx, &expense)
}

