from fastapi import FastAPI, Request, WebSocket
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from typing import List

server = FastAPI()

server.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

active_connections: List[WebSocket] = []

@server.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={"netloc":request.base_url.netloc}
    )

@server.websocket("/cursor")
async def cursor_websocket(websocket: WebSocket):
    await websocket.accept()

    active_connections.append(websocket)

    try:
        while True:
            data = await websocket.receive_json()
            
            for connection in active_connections:
                if connection != websocket:
                    await connection.send_json(data)
    except:
        active_connections.remove(websocket)
