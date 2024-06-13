package auth

import (
	"crypto/rand"
	"encoding/hex"
	"money-monkey/api/db"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

var secretKey string

func Initialize() {
	secretKey = os.Getenv("JWT_KEY")
}

func checkPassword(username string, password string) (int, error) {
	authData, err := db.GetAuthData(username)
	if err != nil {
		return -1, err
	}

	decoded, err := hex.DecodeString(password + authData.Salt)
	if err != nil {
		return -1, err
	}

	if bcrypt.CompareHashAndPassword([]byte(authData.Password), decoded) == nil {
		return authData.Id, nil
	}

	return -1, nil
}

func generateJWT(userId int) (string, error) {
	expirationTime := time.Now().Add(15 * time.Minute)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &claims{
		UserId: userId,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	})

	return token.SignedString(secretKey)
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
