package main

import (
	"encoding/json"
	"net/http"
	"os"
	"time"
)

type Response struct {
	Status string `json:"status"`
	Time   string `json:"time"`
	Path   string `json:"path"`
}

func handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(Response{
		Status: "OK",
		Time:   time.Now().Format(time.RFC3339),
		Path:   r.URL.Path,
	})
}

func main() {
	http.HandleFunc("/", handler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8017"
	}

	println("Server running on port " + port)

	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		panic(err)
	}
}
