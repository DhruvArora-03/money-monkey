package utils

import (
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/go-playground/validator/v10"
)

var ErrBrokenRequestBody = errors.New("unable to parse request body")
var ErrInvalidRequestBody = errors.New("invalid request body")

type wrappedWriter struct {
	http.ResponseWriter
	statusCode int
}

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

		log.Println(r.Method, r.URL.Path, writer.statusCode, time.Since(start))
	})
}

func ValidateRequestBody(body io.ReadCloser, s interface{}) error {
	err := json.NewDecoder(body).Decode(&s)
	if err != nil {
		return ErrBrokenRequestBody
	}

	validate := validator.New()
	err = validate.Struct(s)
	if err != nil {
		return ErrInvalidRequestBody
	}

	return nil
}
