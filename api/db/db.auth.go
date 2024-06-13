package db

import (
	"context"
	"money-monkey/api/models"

	"github.com/georgysavva/scany/v2/pgxscan"
)

func AddNewUser(firstName string, lastName string, username string, password string, salt string) error {
	_, err := dbpool.Exec(context.Background(), `
		INSERT INTO users (first_name, last_name, username, password, salt)
		VALUES ($1, $2, $3, $4, $5)`,
		firstName, lastName, username, password, salt)

	return err
}

func GetAuthData(username string) (models.AuthInfo, error) {
	var res models.AuthInfo

	err := pgxscan.Get(context.Background(), dbpool, &res, `
		SELECT u.id, u.password, u.salt
		FROM users
		WHERE username = $1`, username)

	return res, err
}
