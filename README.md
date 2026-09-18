# wosmos

Vite + React frontend, Go backend, served from one process.

## Dev (hot reload, both server and client)

```sh
docker compose up --build
```

- App: http://localhost:8080
- The Go server (running under [air](https://github.com/air-verse/air)) proxies non-API
  requests, including the Vite HMR websocket, to the Vite dev server, so both frontend
  and backend hot reload.
- `air` rebuilds and restarts the Go server on `.go` file changes.
- Vite hot-reloads React changes in the browser without a restart.

## Production build

```sh
cd frontend && npm run build   # outputs to ../backend/dist
cd backend && go build .       # embeds dist/ into the binary
./backend
```
