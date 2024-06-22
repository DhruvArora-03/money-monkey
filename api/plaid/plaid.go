package plaid

import (
	"context"
	"encoding/json"
	"log"
	"money-monkey/api/auth"
	"money-monkey/api/middleware"
	"money-monkey/api/types"
	"net/http"
	"os"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/plaid/plaid-go/v21/plaid"
)

var environments = map[string]plaid.Environment{
	"SANDBOX":    plaid.Sandbox,
	"PRODUCTION": plaid.Production,
}
var envKeys = map[string]string{
	"SANDBOX":    "PLAID_SANDBOX_SECRET",
	"PRODUCTION": "PLAID_PRODUCTION_SECRET",
}

var (
	PLAID_PRODUCTS                       = ""
	PLAID_COUNTRY_CODES                  = ""
	PLAID_REDIRECT_URI                   = ""
	client              *plaid.APIClient = nil
)

func Initialize() {
	PLAID_ENV := os.Getenv("PLAID_ENV")
	if PLAID_ENV == "" {
		log.Fatal("PLAID_ENV is not set.")
	} else if PLAID_ENV != "SANDBOX" && PLAID_ENV != "PRODUCTION" {
		log.Fatal("Invalid PLAID_ENV")
	}

	client_id := os.Getenv("PLAID_CLIENT_ID")
	secret := os.Getenv(envKeys[PLAID_ENV])
	PLAID_PRODUCTS = os.Getenv("PLAID_PRODUCTS")
	PLAID_COUNTRY_CODES = os.Getenv("PLAID_COUNTRY_CODES")
	PLAID_REDIRECT_URI = os.Getenv("PLAID_REDIRECT_URI")

	if client_id == "" {
		log.Fatal("PLAID_CLIENT_ID is not set.")
	}
	if secret == "" {
		log.Fatalf("%s is not set.", envKeys[PLAID_ENV])
	}
	if PLAID_ENV == "" {
		log.Fatal("PLAID_ENV is not set.")
	}
	if PLAID_PRODUCTS == "" {
		log.Fatal("PLAID_PRODUCTS is not set.")
	}
	if PLAID_COUNTRY_CODES == "" {
		log.Fatal("PLAID_COUNTRY_CODES is not set.")
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

	router.HandleFunc("GET /plaid/create-link-token", middleware.Auth(createLinkToken))
	router.HandleFunc("POST /plaid/generate-access-token", middleware.Auth(generateAccessToken))

	return router
}

func createLinkToken(w http.ResponseWriter, r *http.Request) {
	clientUserId, ok := r.Context().Value(auth.UserIdKey).(int)
	if !ok {
		http.Error(w, "Authentication issue, unable to read userId from request", http.StatusInternalServerError)
		return
	}

	request := plaid.NewLinkTokenCreateRequest(
		"Money Monkey",
		"en",
		[]plaid.CountryCode{plaid.COUNTRYCODE_US},
		*plaid.NewLinkTokenCreateRequestUser(strconv.Itoa(clientUserId)),
	)
	request.SetProducts([]plaid.Products{plaid.PRODUCTS_AUTH})

	resp, _, err := client.PlaidApi.LinkTokenCreate(context.Background()).LinkTokenCreateRequest(*request).Execute()
	if err != nil {
		log.Println(err.Error())
		http.Error(w, "Plaid could not generate link token.", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(types.LinkTokenResponse{
		LinkToken: resp.GetLinkToken(),
	})
}

func generateAccessToken(w http.ResponseWriter, r *http.Request) {
	_, ok := r.Context().Value(auth.UserIdKey).(int)
	if !ok {
		http.Error(w, "Authentication issue, unable to read userId from request", http.StatusInternalServerError)
		return
	}

	var request types.GenerateAccessTokenRequest

	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		http.Error(w, "Broken request body", http.StatusBadRequest)
		return
	}

	validate := validator.New()
	err = validate.Struct(request)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// exchange the public_token for an access_token
	exchangePublicTokenResp, _, err := client.PlaidApi.ItemPublicTokenExchange(context.Background()).ItemPublicTokenExchangeRequest(
		*plaid.NewItemPublicTokenExchangeRequest(request.PublicToken),
	).Execute()
	if err != nil {
		http.Error(w, "unable to exchange token: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// These values should be saved to a persistent database and
	// associated with the currently signed-in user
	accessToken := exchangePublicTokenResp.GetAccessToken()
	itemId := exchangePublicTokenResp.GetItemId()

	log.Println(accessToken)
	log.Println(itemId)

	w.Header().Set("Content-Type", "text/plain")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Complete!\n" + accessToken + "\n" + itemId))
}
