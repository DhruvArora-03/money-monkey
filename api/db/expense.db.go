package db

import (
	"context"
	"money-monkey/api/types"

	"github.com/davecgh/go-spew/spew"
	"github.com/georgysavva/scany/v2/pgxscan"
)

func CreateExpense(ctx context.Context, expense *types.ExpensePartial) error {

	return nil
}

func ImportPlaidExpense(ctx context.Context, plaidTransactionId, categoryId int) error {
	var expense types.ExpensePartial

	err := pgxscan.Get(ctx, dbpool, &expense, `
			SELECT pt.user_id, pt.name, pt.amount_cents, pt.date
			FROM plaid_transaction pt
			WHERE pt.id = $1`,
		plaidTransactionId)
	if err != nil {
		return err
	}

	spew.Dump(expense)

	return err
}
