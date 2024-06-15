package types

import "github.com/golang-jwt/jwt/v5"

type contextKey string

const UserIdKey contextKey = "userId"

type Claims struct {
	UserId int
	jwt.RegisteredClaims
}
