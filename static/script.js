class Cursor {
    constructor(elemId) {
        this.elem = document.getElementById(elemId);
    }

    getDimensions() {
        return {
            height: this.elem.offsetHeight,
            width: this.elem.offsetWidth
        }
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

function main() {
    const url = "ws://localhost:8000/cursor"
    const ws = new WebSocket(url);
    const c = new Cursor("cursor");

    const updateCursorPositionsDisplay = (x, y) => {
        document.getElementById("x").innerHTML = String(x).padStart(4, "0");
        document.getElementById("y").innerHTML = String(y).padStart(4, "0");
    };

    ws.onopen = (e) => {
        document.getElementById("connection-status").innerHTML = "CONNECTED TO SERVER";
        document.getElementById("connection-url").innerHTML = `${url}`;
    }

    ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        updateCursorPositionsDisplay(data.x, data.y)
        c.setLoc(data.x, data.y);
    };

    document.getElementById("canvas").addEventListener("mousemove", (e) => {
        c.setLoc(e.clientX, e.clientY);
        updateCursorPositionsDisplay(e.clientX, e.clientY)
        ws.send(JSON.stringify(c.getLoc()))
    });
}

document.addEventListener("DOMContentLoaded", main);

