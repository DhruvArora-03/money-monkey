package db

import (
	"context"
	"money-monkey/api/models/dao"

	"github.com/georgysavva/scany/v2/pgxscan"
)

func AddNewUser(firstName string, lastName string, username string, password string, salt string) (int, error) {
	var res struct {
		Id int `db:"id"`
	}

	err := pgxscan.Get(context.Background(), dbpool, &res, `
		INSERT INTO users (first_name, last_name, username, password, salt)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id`,
		firstName, lastName, username, password, salt)

	return res.Id, err
}

func GetUserAuth(username string) (dao.AuthInfo, error) {
	var res dao.AuthInfo

	err := pgxscan.Get(context.Background(), dbpool, &res, `
		SELECT u.id, u.password, u.salt
		FROM users u
		WHERE u.username = $1`,
		username)

	return res, err
}
