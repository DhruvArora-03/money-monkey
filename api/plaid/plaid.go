package plaid

import (
	"context"
	"encoding/json"
	"log"
	"money-monkey/api/auth"
	"net/http"
	"os"

	"github.com/plaid/plaid-go/v21/plaid"
)

var environments = map[string]plaid.Environment{
	"sandbox":     plaid.Sandbox,
	"development": plaid.Development,
	"production":  plaid.Production,
}

var (
	PLAID_PRODUCTS                       = ""
	PLAID_COUNTRY_CODES                  = ""
	PLAID_REDIRECT_URI                   = ""
	client              *plaid.APIClient = nil
)

func Initialize() {
	// set constants from env
	client_id := os.Getenv("PLAID_CLIENT_ID")
	secret := os.Getenv("PLAID_SECRET")

	if client_id == "" {
		log.Fatal("PLAID_CLIENT_ID is not set.")
	}
	if secret == "" {
		log.Fatal("PLAID_SECRET is not set.")
	}

	PLAID_ENV := os.Getenv("PLAID_ENV")
	PLAID_PRODUCTS = os.Getenv("PLAID_PRODUCTS")
	PLAID_COUNTRY_CODES = os.Getenv("PLAID_COUNTRY_CODES")
	PLAID_REDIRECT_URI = os.Getenv("PLAID_REDIRECT_URI")

	if PLAID_PRODUCTS == "" {
		log.Fatal("PLAID_PRODUCTS is not set.")
	}
	if PLAID_COUNTRY_CODES == "" {
		log.Fatal("PLAID_COUNTRY_CODES is not set.")
	}
	if PLAID_ENV == "" {
		log.Fatal("PLAID_ENV is not set.")
	}

	// create Plaid client
	configuration := plaid.NewConfiguration()
	configuration.AddDefaultHeader("PLAID-CLIENT-ID", client_id)
	configuration.AddDefaultHeader("PLAID-SECRET", secret)
	configuration.UseEnvironment(environments[PLAID_ENV])
	client = plaid.NewAPIClient(configuration)
}

func NewRouter() http.Handler {
	router := http.NewServeMux()

	router.HandleFunc("POST /plaid/create-link-token", createLinkToken)
	router.HandleFunc("POST /plaid/generate-access-token", generateAccessToken)

	return router
}

func createLinkToken(w http.ResponseWriter, r *http.Request) {
	clientUserId, ok := r.Context().Value(auth.UserIdKey).(string)
	if !ok {
		http.Error(w, "Authentication issue, unable to read userId from request", http.StatusInternalServerError)
	}

	request := plaid.NewLinkTokenCreateRequest("Money Monkey", "en", []plaid.CountryCode{plaid.COUNTRYCODE_US}, *plaid.NewLinkTokenCreateRequestUser(clientUserId))
	request.SetProducts([]plaid.Products{plaid.PRODUCTS_AUTH})

	resp, _, err := client.PlaidApi.LinkTokenCreate(context.Background()).LinkTokenCreateRequest(*request).Execute()
	if err != nil {
		http.Error(w, "Plaid could not generate link token.", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(linkTokenResponse{
		Link_token: resp.GetLinkToken(),
	})
}

func generateAccessToken(w http.ResponseWriter, r *http.Request) {
	// publicToken := c.PostForm("public_token")
	publicToken := ""

	// exchange the public_token for an access_token
	exchangePublicTokenResp, _, err := client.PlaidApi.ItemPublicTokenExchange(context.Background()).ItemPublicTokenExchangeRequest(
		*plaid.NewItemPublicTokenExchangeRequest(publicToken),
	).Execute()
	if err != nil {
		http.Error(w, "unable to exchange token: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// These values should be saved to a persistent database and
	// associated with the currently signed-in user
	accessToken := exchangePublicTokenResp.GetAccessToken()
	itemID := exchangePublicTokenResp.GetItemId()

	w.Header().Set("Content-Type", "text/plain")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Complete!\n" + accessToken + "\n" + itemID))
}
