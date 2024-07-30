package services

import (
	"context"
	"errors"
	"log"
	"money-monkey/api/db"
	"money-monkey/api/types"
	"os"

	"github.com/plaid/plaid-go/v21/plaid"
)

var ErrLinkTokenGeneration = errors.New("unable to generate link token")
var ErrPublicTokenExchange = errors.New("unable to create access token")
var ErrPlaidConnectionRegistration = errors.New("unable to register plaid connection")
var ErrInvalidPlaidConnectionId = errors.New("unable to get connection from plaid using given id")
var ErrFetchTransactions = errors.New("unable to fetch transactions from plaid")

var environments = map[string]plaid.Environment{
	"SANDBOX":    plaid.Sandbox,
	"PRODUCTION": plaid.Production,
}
var envKeys = map[string]string{
	"SANDBOX":    "PLAID_SANDBOX_SECRET",
	"PRODUCTION": "PLAID_PRODUCTION_SECRET",
}

var (
	PLAID_PRODUCTS                      = ""
	PLAID_REDIRECT_URI                  = ""
	client             *plaid.APIClient = nil
)

func InitializePlaid() {
	PLAID_ENV := os.Getenv("PLAID_ENV")
	if PLAID_ENV == "" {
		log.Fatal("PLAID_ENV is not set.")
	} else if PLAID_ENV != "SANDBOX" && PLAID_ENV != "PRODUCTION" {
		log.Fatal("Invalid PLAID_ENV")
	}

	client_id := os.Getenv("PLAID_CLIENT_ID")
	secret := os.Getenv(envKeys[PLAID_ENV])
	if client_id == "" {
		log.Fatal("PLAID_CLIENT_ID is not set.")
	}
	if secret == "" {
		log.Fatalf("%s is not set.", envKeys[PLAID_ENV])
	}

	PLAID_PRODUCTS = os.Getenv("PLAID_PRODUCTS")
	PLAID_REDIRECT_URI = os.Getenv("PLAID_REDIRECT_URI")
	if PLAID_PRODUCTS == "" {
		log.Fatal("PLAID_PRODUCTS is not set.")
	}

	// create Plaid client
	configuration := plaid.NewConfiguration()
	configuration.AddDefaultHeader("PLAID-CLIENT-ID", client_id)
	configuration.AddDefaultHeader("PLAID-SECRET", secret)
	configuration.UseEnvironment(environments[PLAID_ENV])
	client = plaid.NewAPIClient(configuration)
}

func CreateLinkToken(ctx context.Context, userId string) (string, error) {
	request := plaid.NewLinkTokenCreateRequest(
		"Money Monkey",
		"en",
		[]plaid.CountryCode{plaid.COUNTRYCODE_US},
		*plaid.NewLinkTokenCreateRequestUser(userId),
	)
	request.SetProducts([]plaid.Products{plaid.PRODUCTS_AUTH})

	resp, _, err := client.PlaidApi.LinkTokenCreate(ctx).LinkTokenCreateRequest(*request).Execute()
	if err != nil {
		return "", ErrLinkTokenGeneration
	}

	return resp.GetLinkToken(), nil
}

func GenerateAccessToken(ctx context.Context, userId string, publicToken string) error {
	exchangePublicTokenResp, _, err := client.PlaidApi.ItemPublicTokenExchange(ctx).ItemPublicTokenExchangeRequest(
		*plaid.NewItemPublicTokenExchangeRequest(publicToken),
	).Execute()
	if err != nil {
		return ErrPublicTokenExchange
	}

	accessToken := exchangePublicTokenResp.GetAccessToken()
	itemId := exchangePublicTokenResp.GetItemId()

	_, err = db.AddPlaidConnection(ctx, userId, accessToken, itemId)
	if err != nil {
		return ErrPlaidConnectionRegistration
	}

	return nil
}

func FetchTransactions(ctx context.Context, plaidConnectionId int) (*types.FetchTransactionsResult, error) {
	plaidConnection, err := db.GetPlaidConnection(ctx, plaidConnectionId)
	if err != nil {
		return nil, ErrInvalidPlaidConnectionId
	}

	var added []plaid.Transaction
	var modified []plaid.Transaction
	var removed []plaid.RemovedTransaction
	hasMore := true
	for hasMore {
		request := plaid.NewTransactionsSyncRequest(plaidConnection.AccessToken)

		if plaidConnection.Cursor != nil {
			request.SetCursor(*plaidConnection.Cursor)
		}
		res, _, err := client.PlaidApi.TransactionsSync(ctx).TransactionsSyncRequest(*request).Execute()
		if err != nil {
			return nil, ErrFetchTransactions
		}

		// Add this page of results
		added = append(added, res.GetAdded()...)
		modified = append(modified, res.GetModified()...)
		removed = append(removed, res.GetRemoved()...)
		hasMore = res.GetHasMore()

		// Update cursor to the next cursor
		next := res.GetNextCursor()
		plaidConnection.Cursor = &next
	}

	db.UpdateTransactions(ctx, plaidConnection, added, modified, removed)

	return &types.FetchTransactionsResult{
		NumAdded:    len(added),
		NumModified: len(modified),
		NumRemoved:  len(removed),
	}, nil
}
