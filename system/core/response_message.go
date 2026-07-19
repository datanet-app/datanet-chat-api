package core

import (
	"encoding/json"
	"net/http"
	"time"
)

type StatusResponse struct {
	Status string `json:"status"`
	Time   string `json:"time"`
	Path   string `json:"path"`
}

func NewStatusResponse(status string, r *http.Request) StatusResponse {
	return StatusResponse{
		Status: status,
		Time:   time.Now().Format(time.RFC3339),
		Path:   r.URL.Path + "?" + r.URL.RawQuery,
	}
}

func ResponseWith(status string, w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()

	if query.Get("delay") == "false" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(NewStatusResponse(status, r))
		return
	}
	select {
	case <-time.After(10 * time.Second):
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

		json.NewEncoder(w).Encode(NewStatusResponse(status, r))

	case <-r.Context().Done():
		return
	}
}
