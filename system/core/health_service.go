package core

import (
	"net/http"
)

func ServerHealth(w http.ResponseWriter, r *http.Request) {
	ResponseWith("OK", w, r)
}
