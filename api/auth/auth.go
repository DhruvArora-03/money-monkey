package auth

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"log"
	"money-monkey/api/db"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type contextKey string

type claims struct {
	UserId int
	jwt.RegisteredClaims
}

const UserIdKey contextKey = "userId"

var jwtKey []byte

func Initialize() {
	key := os.Getenv("JWT_KEY")
	if key == "" {
		log.Fatal("JWT_KEY is not set.")
	}
	jwtKey = []byte(key)
}

func checkPassword(username string, password string) (int, error) {
	user, err := db.GetUserAuth(username)
	if err != nil {
		return -1, err
	}

	decoded, err := hex.DecodeString(password + user.Salt)
	if err != nil {
		return -1, err
	}

	if bcrypt.CompareHashAndPassword([]byte(user.Password), decoded) != nil {
		return -1, nil
	}

	return user.Id, nil
}

func ExtractClaims(r *http.Request) (*claims, error) {
	authHeader := r.Header.Get("Authorization")

	if authHeader == "" {
		return nil, errors.New("authorization not found")
	}

	if !strings.HasPrefix(authHeader, "Bearer ") {
		return nil, errors.New("invalid token format")
	}

	token, err := jwt.ParseWithClaims(strings.TrimPrefix(authHeader, "Bearer "), &claims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil {
		return nil, errors.New("could not parse authorization token")
	}

	claims, ok := token.Claims.(*claims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid authorization token")
	}

	return claims, nil
}

func generateJWT(userId int) (string, error) {
	claims := &claims{
		UserId: userId,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtKey)
}

func generateSalt() (string, error) {
	salt := make([]byte, 16)
	_, err := rand.Read(salt)
	return hex.EncodeToString(salt), err
}

func hashPassword(password string, salt string) (string, error) {
	decodedPassword, err := hex.DecodeString(password)
	if err != nil {
		return "", err
	}

	decodedSalt, err := hex.DecodeString(salt)
	if err != nil {
		return "", err
	}

	combined := append(decodedPassword, decodedSalt...)
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(combined), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}

	return string(hashedPassword), nil
}
