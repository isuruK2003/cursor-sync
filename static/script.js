// Requires cursor.js in index.html
// Requires Alert.js in index.html

const canvasElem = document.getElementById("canvas");
const connectionToggleElem = document.getElementById("connection-toggle");
const trackingToggleElem = document.getElementById("tracking-toggle");
const connectionUrlElem = document.getElementById("connection-url");
const xCoordinateElem = document.getElementById("x");
const yCoordinateElem = document.getElementById("y");

function updateCursorPositionsDisplay(x, y) {
    xCoordinateElem.innerHTML = String(x).padStart(4, "0");
    yCoordinateElem.innerHTML = String(y).padStart(4, "0");
}

function setupWebSocket(url, cursor) {
    const ws = new WebSocket(url);

    ws.onopen = () => {
        connectionToggleElem.innerHTML = "CONNECTED";
        connectionToggleElem.classList.remove("off");
        connectionToggleElem.classList.add("on");

    };

    ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        updateCursorPositionsDisplay(data.x, data.y);
        cursor.setLoc(data.x, data.y);
    };

    ws.onclose = () => {
        connectionToggleElem.innerHTML = "DISCONNECTED";
        connectionToggleElem.classList.remove("on");
        connectionToggleElem.classList.add("off");
    };

    ws.onerror = (e) => {
        const alert = new Alert("An error occurred in the connection", "Try refreshing the page")
        alert.show();
    };

    return ws;
}

function main() {

    const readWsUrl = () => `ws://${connectionUrlElem.value}/cursor`;

    const cursor = new Cursor("cursor");
    let ws = setupWebSocket(readWsUrl(), cursor);
    let trackingEnabled = true;

    const handleCanvasMouseMove = (e) => {
        if (!trackingEnabled) return;

        cursor.setLoc(e.clientX, e.clientY);
        updateCursorPositionsDisplay(e.clientX, e.clientY);

        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(cursor.getLoc()));
        }
    };

    const handleUrlChanges = (e) => {
        if (ws) {
            ws.close();
        }
        ws = setupWebSocket(readWsUrl(), cursor);
    };

    const toggleTracking = () => {
        if (trackingEnabled) {
            trackingToggleElem.classList.remove("on");
            trackingToggleElem.classList.add("off");
            trackingToggleElem.innerHTML = "TRACKING DISABLED";
            trackingEnabled = false;
            canvasElem.style.cursor = "default";
        } else {
            trackingToggleElem.classList.remove("off");
            trackingToggleElem.classList.add("on");
            trackingToggleElem.innerHTML = "TRACKING ENABLED";
            trackingEnabled = true;
            canvasElem.style.cursor = "none";
        }
    };

    // Registering Mouse Events
    canvasElem.addEventListener("mousemove", handleCanvasMouseMove);
    connectionUrlElem.addEventListener("change", handleUrlChanges);
    trackingToggleElem.addEventListener("click", toggleTracking);

    // Registering Keyboard Events
    document.addEventListener("keypress", (e) => e.key.toLowerCase() === "t" && toggleTracking());      
}

document.addEventListener("DOMContentLoaded", main);
