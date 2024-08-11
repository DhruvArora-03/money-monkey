package utils

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/go-playground/validator/v10"
)

var ErrMissingUserHeader = errors.New("missing X-User-Id header")
var ErrBrokenRequestBody = errors.New("unable to parse request body")
var ErrInvalidRequestBody = errors.New("invalid request body")

type wrappedWriter struct {
	http.ResponseWriter
	statusCode int
}
type contextKey string

const userIDKey contextKey = "userId"

func (w *wrappedWriter) WriteHeader(statusCode int) {
	w.ResponseWriter.WriteHeader(statusCode)
	w.statusCode = statusCode
}

func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		writer := &wrappedWriter{
			ResponseWriter: w,
			statusCode:     http.StatusOK,
		}
		next.ServeHTTP(writer, r)

		log.Println("API:", r.Method, r.URL.Path, writer.statusCode, time.Since(start))
	})
}

func UserIdMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userId := r.Header.Get("X-User-Id")

		if userId == "" {
			http.Error(w, ErrMissingUserHeader.Error(), http.StatusBadRequest)
			return
		}

		next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), userIDKey, userId)))
	})
}

func GetUserId(ctx context.Context) string {
	id := ctx.Value(userIDKey)
	if id == nil {
		return ""
	}
	return id.(string)
}

func ValidateRequestBody(body io.ReadCloser, s interface{}) error {
	err := json.NewDecoder(body).Decode(&s)
	if err != nil {
		return ErrBrokenRequestBody
	}

	validate := validator.New(validator.WithRequiredStructEnabled())
	err = validate.Struct(s)
	if err != nil {
		return ErrInvalidRequestBody
	}

	return nil
}
