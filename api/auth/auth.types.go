package auth

import (
	"github.com/golang-jwt/jwt/v5"
)

type claims struct {
	UserId int
	jwt.RegisteredClaims
}
