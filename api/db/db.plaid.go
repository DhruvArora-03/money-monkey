package db

import (
	"context"
	"money-monkey/api/model"

	"github.com/georgysavva/scany/v2/pgxscan"
	"github.com/jackc/pgx/v5"
	"github.com/plaid/plaid-go/v21/plaid"
)

func AddPlaidConnection(ctx context.Context, userId int, accessToken string, itemId string) (int, error) {
	var res struct {
		Id int `db:"id"`
	}

	err := pgxscan.Get(ctx, dbpool, &res, `
			INSERT INTO plaid_connection (user_id, access_token, item_id)
			VALUES ($1, $2, $3)
			RETURNING id`,
		userId, accessToken, itemId)

	return res.Id, err
}

func GetPlaidConnection(ctx context.Context, id int) (model.PlaidConnection, error) {
	var res model.PlaidConnection

	err := pgxscan.Get(ctx, dbpool, &res, `
			SELECT pc.id, pc.user_id, pc.access_token, pc.item_id, pc.cursor
			FROM plaid_connection pc
			WHERE pc.id = $1`, id)

	return res, err
}

func UpdateTransactions(ctx context.Context, userId int, id int, added []plaid.Transaction, modified []plaid.Transaction, removed []plaid.RemovedTransaction, cursor *string) error {
	batch := &pgx.Batch{}

	for _, tran := range added {
		batch.Queue(`
			INSERT INTO plaid_transaction (user_id, plaid_connection_id, )	
		`)
	}

	err := dbpool.Exec(ctx, `
	`)

	return err
}
