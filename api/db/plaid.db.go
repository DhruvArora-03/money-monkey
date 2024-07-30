package db

import (
	"context"
	"log"
	"math"
	"money-monkey/api/types"
	"strings"

	"github.com/georgysavva/scany/v2/pgxscan"
	"github.com/jackc/pgx/v5"
	"github.com/plaid/plaid-go/v21/plaid"
)

func AddPlaidConnection(ctx context.Context, userId string, accessToken string, itemId string) (int, error) {
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

func GetPlaidConnection(ctx context.Context, id int) (types.PlaidConnection, error) {
	var res types.PlaidConnection

	err := pgxscan.Get(ctx, dbpool, &res, `
			SELECT pc.id, pc.user_id, pc.access_token, pc.item_id, pc.cursor
			FROM plaid_connection pc
			WHERE pc.id = $1`, id)

	return res, err
}

func UpdateTransactions(ctx context.Context, connection types.PlaidConnection, added, modified []plaid.Transaction, removed []plaid.RemovedTransaction) {
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
			) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
			connection.UserId,
			connection.Id,
			tran.GetTransactionId(),
			tran.GetName(),
			int(math.Floor(tran.GetAmount()*100)),
			tran.GetDate(),
			strings.Join(tran.GetCategory(), ", "),
			tran.GetMerchantName(),
			tran.GetPersonalFinanceCategory().Primary,
			tran.GetTransactionType(),
		)
		log.Println("DONE ADDING ", tran.GetName())
		log.Println("amount: ", tran.GetAmount())
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
			connection.UserId,
			connection.Id,
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
			connection.UserId,
			connection.Id,
			tran.GetTransactionId(),
		)
	}

	res := dbpool.SendBatch(ctx, batch)
	defer res.Close()

	for range added {
		result, err := res.Exec()
		if err != nil {
			log.Println("error adding transactions to db: ", err)
		}
		log.Println(result.String())
	}

	for range modified {
		res.Exec()
	}

	for range removed {
		res.Exec()
	}
}
