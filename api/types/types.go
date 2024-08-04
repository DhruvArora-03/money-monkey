package types

type ExpensePartial struct {
	UserId      string `json:"user_id" validate:"required"`
	CategoryId  int    `json:"category_id" validate:"required"`
	Name        string `json:"name" validate:"required"`
	Date        string `json:"date" validate:"required"`
	AmountCents int    `json:"amount_cents" validate:"required"`
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
