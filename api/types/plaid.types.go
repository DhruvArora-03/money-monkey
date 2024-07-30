package types

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
