class Cursor {
    constructor(elemId) {
        this.elem = document.getElementById(elemId);
    }

    getDimensions() {
        return {
            height: this.elem.offsetHeight,
            width: this.elem.offsetWidth
        };
    }

    setDimensions(height, width) {
        this.elem.style.width = `${width}px`;
        this.elem.style.height = `${height}px`;
    }

    getLoc() {
        const elem = this.elem.getBoundingClientRect();
        return {
            x: elem.x,
            y: elem.y
        };
    }

    setLoc(x, y) {
        this.elem.style.position = 'absolute';
        this.elem.style.left = `${x}px`;
        this.elem.style.top = `${y}px`;
    }
}

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
        alert("WebSocket Error: " + e.message);
    };

    return ws;
}

function main() {
    const cursor = new Cursor("cursor");
    let url = document.getElementById("connection-url").value;
    let ws = setupWebSocket(url, cursor);

    document.getElementById("canvas").addEventListener("mousemove", (e) => {
        cursor.setLoc(e.clientX, e.clientY);
        updateCursorPositionsDisplay(e.clientX, e.clientY);

        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(cursor.getLoc()));
        }
    });

    document.getElementById("connection-url").addEventListener("change", (event) => {
        url = event.target.value;
        if (ws) {
            ws.close();
        }
        ws = setupWebSocket(url, cursor);
    });
}

document.addEventListener("DOMContentLoaded", main);
