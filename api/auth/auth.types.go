package auth

import "github.com/dgrijalva/jwt-go"

type claims struct {
	UserId int
	jwt.StandardClaims
}
