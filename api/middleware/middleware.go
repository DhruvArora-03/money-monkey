package middleware

import (
	"context"
	"log"
	"money-monkey/api/auth"
	"net/http"
	"time"
)

type wrappedWriter struct {
	http.ResponseWriter
	statusCode int
}

func (w *wrappedWriter) WriteHeader(statusCode int) {
	w.ResponseWriter.WriteHeader(statusCode)
	w.statusCode = statusCode
}

func Logging(next http.Handler) http.Handler {
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

func Auth(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		claims, err := auth.ExtractClaims(r)
		if err != nil {
			status := http.StatusBadRequest
			if err == auth.ErrExpiredToken {
				status = http.StatusUnauthorized
			}
			http.Error(w, err.Error(), status)
			return
		}

		ctx := context.WithValue(r.Context(), auth.UserIdKey, claims.UserId)
		r = r.WithContext(ctx)

		next.ServeHTTP(w, r)
	})
}
