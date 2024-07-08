package db

import (
	"context"
	"money-monkey/api/model"
	"money-monkey/api/types"

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

func UpdateTransactions(ctx context.Context, userId, plaidConnectionId int, added, modified []plaid.Transaction, removed []plaid.RemovedTransaction, cursor *string) types.FetchTransactionsResponse {
	batch := &pgx.Batch{}

	for _, tran := range added {
		batch.Queue(`
			INSERT INTO plaid_transaction (
				user_id,
			    plaid_connection_id,
				transaction_id,
				name,
				amount_cents,
				date,
				category,
				merchant_name,
				personal_finance_category,
				transaction_type
			) VALUES ($2, $3, $4, $5, $6, $7, $8, $9, $10)`,
			userId,
			plaidConnectionId,
			tran.GetTransactionId(),
			tran.GetName(),
			tran.GetAmount(),
			tran.GetDate(),
			tran.GetCategory(),
			tran.GetAuthorizedDate(),
			tran.GetMerchantName(),
			tran.GetPersonalFinanceCategory(),
			tran.GetTransactionType(),
		)
	}

	for _, tran := range modified {
		batch.Queue(`
			UPDATE plaid_transaction
			SET
				name = $3,
				amount_cents = $4,
				date = $5,
				category = $6,
				merchant_name = $7,
				personal_finance_category = $8,
				transaction_type = $9
			WHERE
				user_id = $1 AND
				plaid_connection_id = $2 AND
				transaction_id = $3`,
			userId,
			plaidConnectionId,
			tran.GetTransactionId(),
			tran.GetName(),
			tran.GetAmount(),
			tran.GetDate(),
			tran.GetCategory(),
			tran.GetAuthorizedDate(),
			tran.GetMerchantName(),
			tran.GetPersonalFinanceCategory(),
			tran.GetTransactionType(),
		)
	}

	for _, tran := range removed {
		batch.Queue(`
			DELETE FROM plaid_transaction
			WHERE
				user_id = $1 AND
				plaid_connection_id = $2 AND
				transaction_id = $3`,
			userId,
			plaidConnectionId,
			tran.GetTransactionId(),
		)
	}

	res := dbpool.SendBatch(ctx, batch)
	defer res.Close()

	for range added {
		res.Exec()
	}

	for range modified {
		res.Exec()
	}

	for range removed {
		res.Exec()
	}

	return types.FetchTransactionsResponse{
		NumAdded:    len(added),
		NumModified: len(modified),
		NumRemoved:  len(removed),
	}
}
