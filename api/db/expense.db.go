package db

import (
	"context"
	"money-monkey/api/types"
	"money-monkey/api/utils"

	"github.com/georgysavva/scany/v2/pgxscan"
	"github.com/jackc/pgx/v5"
)

func GetExpenses(ctx context.Context) ([]types.Expense, error) {
	var expenses []types.Expense
	rows, err := dbpool.Query(ctx, `
		SELECT
			e.id,
			e.name,
			e.date,
			e.amount_cents,
			c.name AS category_name
		FROM expense e 
		LEFT JOIN category c ON c.id = e.category_id
		WHERE e.user_id = @user_id`, pgx.NamedArgs{"user_id": utils.GetUserId(ctx)})
	if err != nil {
		return nil, err
	}
	err = pgxscan.ScanAll(&expenses, rows)
	if err != nil {
		return nil, err
	}

	return expenses, nil
}

func CreateExpense(ctx context.Context, expense *types.ExpensePartial) error {
	_, err := dbpool.Exec(ctx, `
		INSERT INTO expense (user_id, name, amount_cents, date, category_id)
		VALUES (@user_id, @name, @amount_cents, @date, @category_id)`,
		pgx.NamedArgs{
			"user_id":      utils.GetUserId(ctx),
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
			SELECT pt.name, pt.amount_cents, pt.date
			FROM plaid_transaction pt
			WHERE pt.id = @plaid_transaction_id`,
		pgx.NamedArgs{"plaid_transaction_id": plaidTransactionId})

	if err != nil {
		return err
	}

	return CreateExpense(ctx, &expense)
}
