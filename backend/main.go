package main

import (
	"embed"
	"flag"
	"io/fs"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
)

//go:embed dist
var embeddedDist embed.FS

func main() {
	addr := flag.String("addr", ":8080", "address to listen on")
	dev := flag.Bool("dev", false, "proxy frontend requests to the Vite dev server instead of serving embedded assets")
	viteDevServer := flag.String("vite-addr", envOr("VITE_DEV_SERVER", "http://localhost:5173"), "address of the Vite dev server to proxy to in -dev mode")
	flag.Parse()

	mux := http.NewServeMux()

	mux.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(`{"status":"ok"}`))
	})

	if *dev {
		mux.Handle("/", devProxy(*viteDevServer))
		log.Printf("dev mode: proxying frontend requests to %s", *viteDevServer)
	} else {
		mux.Handle("/", staticHandler())
		log.Printf("serving embedded frontend build")
	}

	log.Printf("listening on %s", *addr)
	if err := http.ListenAndServe(*addr, mux); err != nil {
		log.Fatal(err)
	}
}

// devProxy forwards everything else to the Vite dev server, including the
// websocket connection Vite uses for HMR.
func devProxy(viteDevServer string) http.Handler {
	target, err := url.Parse(viteDevServer)
	if err != nil {
		log.Fatal(err)
	}
	return httputil.NewSingleHostReverseProxy(target)
}

func envOr(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

// staticHandler serves the production build embedded into the binary.
func staticHandler() http.Handler {
	sub, err := fs.Sub(embeddedDist, "dist")
	if err != nil {
		log.Fatal(err)
	}
	return http.FileServer(http.FS(sub))
}
