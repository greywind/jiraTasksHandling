package config

import (
	"encoding/json"
	"os"
)

type Configuration struct {
	JiraBaseUrl  string
	JiraUsername string
	JiraPassword string
}

var config Configuration

func init() {
	config = Configuration{}
	file, err := os.Open("config.json")
	if err != nil {
		panic(err)
	}
	decoder := json.NewDecoder(file)
	if err = decoder.Decode(&config); err != nil {
		panic(err)
	}
}

func Get() Configuration {
	return config
}
