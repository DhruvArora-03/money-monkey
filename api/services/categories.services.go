package services

import (
	"context"
	"money-monkey/api/db"
	"money-monkey/api/types"
)

func GetCategories(ctx context.Context) (categories *[]types.Category, err error) {
	categories, err = db.GetCategories(ctx)

	if categories == nil {
		categories = &[]types.Category{}
	}

	return categories, err
}
