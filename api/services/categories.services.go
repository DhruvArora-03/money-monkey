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

func GetYearCategorySums(ctx context.Context, year int) (categorySums *[]types.CategorySum, err error) {
	categorySums, err = db.GetYearCategorySums(ctx, year)
	if categorySums == nil {
		categorySums = &[]types.CategorySum{}
	}

	return categorySums, err
}

func GetMonthCategorySums(ctx context.Context, year, month int) (categorySums *[]types.CategorySum, err error) {
	categorySums, err = db.GetMonthCategorySums(ctx, year, month)
	if categorySums == nil {
		categorySums = &[]types.CategorySum{}
	}

	return categorySums, err
}
