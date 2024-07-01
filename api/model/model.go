package model

type AuthInfo struct {
	Id             int    `db:"id"`
	HashedPassword string `db:"password"`
	Salt           string `db:"salt"`
}

type PlaidConnection struct {
	Id          int     `db:"id"`
	UserId      int     `db:"user_id"`
	AccessToken string  `db:"access_token"`
	ItemId      string  `db:"item_id"`
	Cursor      *string `db:"cursor"`
}
