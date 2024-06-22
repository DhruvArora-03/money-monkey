package db

import (
	"context"

	"github.com/georgysavva/scany/v2/pgxscan"
)

func AddPlaidConnection(userId int, accessToken string, itemId string) (int, error) {
	var res struct {
		Id int `db:"id"`
	}

	err := pgxscan.Get(context.Background(), dbpool, &res, `
			INSERT INTO plaid_connection (user_id, access_token, item_id)
			VALUES ($1, $2, $3)
			RETURNING id`,
		userId, accessToken, itemId)

	return res.Id, err
}
