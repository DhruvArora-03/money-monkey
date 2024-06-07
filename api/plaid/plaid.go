package plaid

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
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

func Init() {
	// load env vars from .env file
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error when loading environment variables from .env file %w", err)
	}

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

	router.HandleFunc("GET /plaid/test", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("plaid")
		fmt.Println(client.GetConfig().Host)	
		fmt.Println(client.GetConfig())	
		fmt.Println(client.GetConfig().UserAgent)	

		w.Write([]byte("Success!"))
	})
	router.HandleFunc("GET /plaid/create-link-token", createLinkToken)
	router.HandleFunc("POST /plaid/generate-access-token", getAccessToken)
	
	return router
}

func createLinkToken(w http.ResponseWriter, r *http.Request) {
  // // Get the client_user_id by searching for the current user
  // user, _ := usermodels.Find(...)
  // clientUserId := user.ID.String()
	clientUserId := "12345"


  // Create a link_token for the given user
  request := plaid.NewLinkTokenCreateRequest("Plaid Test App", "en", []plaid.CountryCode{plaid.COUNTRYCODE_US}, *plaid.NewLinkTokenCreateRequestUser(clientUserId))
  request.SetProducts([]plaid.Products{plaid.PRODUCTS_AUTH})

	resp, _, err := client.PlaidApi.LinkTokenCreate(context.Background()).LinkTokenCreateRequest(*request).Execute()
	if err != nil {
		fmt.Println("plaid failed")
		fmt.Println(err.Error())
		http.Error(w, "Plaid could not generate link token." + err.Error(), http.StatusInternalServerError)
		return
	}

  // Send the data to the client
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(struct{
		Link_token string `json:"link_token"`
		}{
  	Link_token: resp.GetLinkToken(),
	})
}

func getAccessToken(w http.ResponseWriter, r *http.Request) {
  ctx := context.Background()
  // publicToken := c.PostForm("public_token")
	publicToken := ""

  // exchange the public_token for an access_token
	exchangePublicTokenResp, _, err := client.PlaidApi.ItemPublicTokenExchange(ctx).ItemPublicTokenExchangeRequest(
		*plaid.NewItemPublicTokenExchangeRequest(publicToken),
	).Execute()
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(struct{
			ErrorMessage string `json:"error_message"`
		}{
			ErrorMessage: err.Error(),
		})
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