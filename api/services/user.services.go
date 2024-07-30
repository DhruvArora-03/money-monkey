package services

import (
	"context"
	"money-monkey/api/db"
)

func CreateUser(ctx context.Context, userId string) error {
	err := db.AddNewUser(ctx, userId)
	return err
}
