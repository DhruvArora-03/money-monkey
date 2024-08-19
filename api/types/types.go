package types

import "time"

type ExpensePartial struct {
	CategoryId  int    `json:"category_id" validate:"required" db:"category_id"`
	Name        string `json:"name" validate:"required" db:"name"`
	Date        string `json:"date" validate:"required" db:"date"`
	AmountCents int    `json:"amount_cents" validate:"required" db:"amount_cents"`
}

type Expense struct {
	Id           int       `json:"id" db:"id"`
	Name         string    `json:"name" db:"name"`
	Date         time.Time `json:"date" db:"date"`
	AmountCents  int       `json:"amount_cents" db:"amount_cents"`
	CategoryName string    `json:"category_name" db:"category_name"`
}

type FetchTransactionsResult struct {
	NumAdded    int `json:"num_added"`
	NumModified int `json:"num_modified"`
	NumRemoved  int `json:"num_removed"`
}

type PlaidConnection struct {
	Id          int     `db:"id"`
	UserId      string  `db:"user_id"`
	AccessToken string  `db:"access_token"`
	ItemId      string  `db:"item_id"`
	Cursor      *string `db:"cursor"`
}

type Category struct {
	Id   int    `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
}

type CategorySum struct {
	CategoryId int    `json:"category_id" db:"category_id"`
	Name       string `json:"name" db:"name"`
	TotalCents int    `json:"total_cents" db:"total_cents"`
}
