package db

import (
	"context"
	"money-monkey/api/types"

	"github.com/davecgh/go-spew/spew"
	"github.com/georgysavva/scany/v2/pgxscan"
	"github.com/jackc/pgx/v5"
)

func CreateExpense(ctx context.Context, expense *types.ExpensePartial) error {
	_, err := dbpool.Exec(ctx, `
		INSERT INTO expense (user_id, name, amount_cents, date, category_id)
		VALUES (@user_id, @name, @amount_cents, @date, @category_id)`,
		pgx.NamedArgs{
			"user_id":      expense.UserId,
			"name":         expense.Name,
			"amount_cents": expense.AmountCents,
			"date":         expense.Date,
			"category_id":  expense.CategoryId,
		})

	return err
}

func ImportPlaidExpense(ctx context.Context, plaidTransactionId, categoryId int) error {
	var expense types.ExpensePartial

	err := pgxscan.Get(ctx, dbpool, &expense, `
			SELECT pt.user_id, pt.name, pt.amount_cents, pt.date
			FROM plaid_transaction pt
			WHERE pt.id = @plaid_transaction_id`,
		pgx.NamedArgs{"plaid_transaction_id": plaidTransactionId})

	if err != nil {
		return err
	}

	spew.Dump(expense)

	_, err = dbpool.Exec(ctx, `
		INSERT INTO expense (user_id, name, amount_cents, date)
		VALUES (@user_id, @name, @amount_cents, @date)`,
		pgx.NamedArgs{
			"user_id":      expense.UserId,
			"name":         expense.Name,
			"amount_cents": expense.AmountCents,
			"date":         expense.Date,
		})

	return err
}
