// Requires cursor.js in index.html
// Requires Alert.js in index.html

function updateCursorPositionsDisplay(x, y) {
    document.getElementById("x").innerHTML = String(x).padStart(4, "0");
    document.getElementById("y").innerHTML = String(y).padStart(4, "0");
}

function setupWebSocket(url, cursor) {
    const ws = new WebSocket(url);

    ws.onopen = () => {
        document.getElementById("connection-status").innerHTML = "CONNECTED";
        document.getElementById("connection-status").className = "connected";
    };

    ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        updateCursorPositionsDisplay(data.x, data.y);
        cursor.setLoc(data.x, data.y);
    };

    ws.onclose = () => {
        document.getElementById("connection-status").innerHTML = "DISCONNECTED";
        document.getElementById("connection-status").className = "disconnected";
    };

    ws.onerror = (e) => {
        const alert = new Alert("An error occurred in the connection", "Try refreshing the page")
        alert.show();
    };

    return ws;
}

function main() {
    const cursor = new Cursor("cursor");
    let url = `ws://${document.getElementById("connection-url").value}/cursor`;
    let ws = setupWebSocket(url, cursor);

    // Handle mousemove in canvas
    document.getElementById("canvas").addEventListener("mousemove", (e) => {
        cursor.setLoc(e.clientX, e.clientY);
        updateCursorPositionsDisplay(e.clientX, e.clientY);

        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(cursor.getLoc()));
        }
    });

    // Handle websocket url changes
    document.getElementById("connection-url").addEventListener("change", (event) => {
        url = event.target.value;
        if (ws) {
            ws.close();
        }
        ws = setupWebSocket(url, cursor);
    });
}

document.addEventListener("DOMContentLoaded", main);
