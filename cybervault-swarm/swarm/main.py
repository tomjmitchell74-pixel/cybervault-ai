import json
import os
from typing import List

from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI(title="CyberVault Swarm Command")
SWARM_TOKEN = os.getenv("SWARM_TOKEN", "")

class ConnectionManager:
    def __init__(self):
        self.active_agents: List[WebSocket] = []
        self.foreman_connection: WebSocket | None = None

    def authorized(self, token: str | None) -> bool:
        return not SWARM_TOKEN or token == SWARM_TOKEN

    async def connect_foreman(self, websocket: WebSocket):
        await websocket.accept()
        self.foreman_connection = websocket

    async def connect_agent(self, websocket: WebSocket):
        await websocket.accept()
        self.active_agents.append(websocket)

    async def broadcast_to_swarm(self, message: str):
        dead = []
        for agent in self.active_agents:
            try:
                await agent.send_text(message)
            except Exception:
                dead.append(agent)
        for agent in dead:
            if agent in self.active_agents:
                self.active_agents.remove(agent)

    async def send_to_foreman(self, message: str):
        if self.foreman_connection:
            try:
                await self.foreman_connection.send_text(message)
            except Exception:
                self.foreman_connection = None

manager = ConnectionManager()

@app.get("/")
async def root():
    return {"service": "CyberVault Swarm Command", "status": "online"}

@app.get("/health")
async def health():
    return {"status": "healthy", "agents": len(manager.active_agents), "foreman": manager.foreman_connection is not None}

@app.websocket("/ws/foreman")
async def foreman_endpoint(websocket: WebSocket):
    token = websocket.query_params.get("token")
    if not manager.authorized(token):
        await websocket.close(code=1008)
        return

    await manager.connect_foreman(websocket)
    await websocket.send_text("CyberVault Command Center Online. Awaiting orders.")
    try:
        while True:
            command = await websocket.receive_text()
            print(f"[FOREMAN COMMAND] {command}")
            payload = json.dumps({"order": command})
            await manager.broadcast_to_swarm(payload)
    except WebSocketDisconnect:
        if manager.foreman_connection is websocket:
            manager.foreman_connection = None
        print("[SYSTEM] Foreman disconnected.")

@app.websocket("/ws/agent/{agent_id}")
async def agent_endpoint(websocket: WebSocket, agent_id: str):
    token = websocket.query_params.get("token")
    if not manager.authorized(token):
        await websocket.close(code=1008)
        return

    await manager.connect_agent(websocket)
    await manager.send_to_foreman(f"[SYSTEM] Agent {agent_id} has joined the swarm.")
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_to_foreman(f"[Agent {agent_id}] {data}")
    except WebSocketDisconnect:
        if websocket in manager.active_agents:
            manager.active_agents.remove(websocket)
        await manager.send_to_foreman(f"[SYSTEM] Agent {agent_id} went offline.")
        print(f"[SYSTEM] Agent {agent_id} disconnected.")
