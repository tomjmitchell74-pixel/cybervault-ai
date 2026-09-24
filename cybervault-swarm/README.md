# CyberVault Swarm Command

FastAPI + WebSocket command server for the CyberVault AI agent swarm.

## Endpoints

- `GET /` — service status
- `GET /health` — health and connection counts
- `wss://YOUR-SERVICE.onrender.com/ws/foreman?token=YOUR_TOKEN` — foreman command channel
- `wss://YOUR-SERVICE.onrender.com/ws/agent/AGENT_ID?token=YOUR_TOKEN` — agent channel

Set `SWARM_TOKEN` in Render Environment Variables. If it is set, clients must provide the same token as the `token` query parameter.

Render supports FastAPI/Uvicorn web services and inbound WebSockets. Public WebSocket clients should use `wss://`.
