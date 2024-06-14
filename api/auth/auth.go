package auth

import (
	"crypto/rand"
	"encoding/hex"
	"log"
	"money-monkey/api/db"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

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

func generateJWT(userId int) (string, error) {
	claims := &claims{
		userId,
		jwt.RegisteredClaims{
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
