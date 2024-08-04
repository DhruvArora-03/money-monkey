package services

import (
	"context"
	"money-monkey/api/db"
	"money-monkey/api/types"
)

func CreateExpense(ctx context.Context, expense *types.ExpensePartial) error {
	return db.CreateExpense(ctx, expense)
}

func ImportPlaidExpense(ctx context.Context, plaidTransactionId, categoryId int) error {
	return db.ImportPlaidExpense(ctx, plaidTransactionId, categoryId)
}
