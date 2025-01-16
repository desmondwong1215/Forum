package token

import (
	"time"

	"github.com/golang-jwt/jwt/v4"
)

// generate a access token which will last for 15 minutes
func GenerateAccessToken(user string, key string) (string, error) {
	claims := jwt.MapClaims{
		"user": user,
		"exp":  time.Now().Add(15 * time.Minute).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(key))
}

// generate a refresh token which will last for 30 days
func GenerateRefreshToken(user string, key string) (string, error) {
	claims := jwt.MapClaims{
		"user": user,
		"exp":  time.Now().Add(30 * 24 * time.Minute).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(key))
}

// verify the token to validate the user access
func VerifyToken(tokenString string, key string) (*jwt.Token, error) {
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(key), nil
	})
}
