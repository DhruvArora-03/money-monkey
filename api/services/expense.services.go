package services

import (
	"context"
	"money-monkey/api/db"
	"money-monkey/api/types"
)

func GetExpenses(ctx context.Context) (expenses *[]types.Expense, err error) {
	expenses, err = db.GetExpenses(ctx)

	if expenses == nil {
		expenses = &[]types.Expense{}
	}

	return expenses, err
}

func CreateExpense(ctx context.Context, expense *types.ExpensePartial) error {
	return db.CreateExpense(ctx, expense)
}

func ImportPlaidExpense(ctx context.Context, plaidTransactionId, categoryId int) error {
	return db.ImportPlaidExpense(ctx, plaidTransactionId, categoryId)
}
