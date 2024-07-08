package types

////////////////////////////////////////////////////////////////////////////////////////////////////
// auth
////////////////////////////////////////////////////////////////////////////////////////////////////

type AuthResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

type LoginRequest struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type RegisterRequest struct {
	FirstName string `json:"first_name" validate:"required"`
	LastName  string `json:"last_name" validate:"required"`
	Username  string `json:"username" validate:"required"`
	Password  string `json:"password" validate:"required"`
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// plaid
////////////////////////////////////////////////////////////////////////////////////////////////////

type GenerateAccessTokenRequest struct {
	PublicToken string `json:"publicToken" validate:"required"`
}

type FetchTransactionsResponse struct {
	NumAdded    int `json:"num_added"`
	NumModified int `json:"num_modified"`
	NumRemoved  int `json:"num_removed"`
}

type LinkTokenResponse struct {
	LinkToken string `json:"link_token"`
}
