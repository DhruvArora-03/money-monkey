package model

type AuthInfo struct {
	Id       int
	Password string
	Salt     string
}