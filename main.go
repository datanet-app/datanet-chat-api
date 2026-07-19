package main

import (
	"datanet-chat-api/system/core"
	"net/http"
	"os"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/check", core.ServerHealth)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8017"
	}

	server := http.Server{
		Addr:    ":" + port,
		Handler: core.EnableCORS(mux),
	}

	println("Server running on port " + port)

	err := server.ListenAndServe()
	if err != nil {
		panic(err)
	}
}
