class Alert {
    constructor(heading, body) {
        this.heading = heading;
        this.body = body;
        this.alertId = `alert-${Date.now()}`;
        this.alertSection = document.getElementById("alert-section");
    }

    close() {
        const alertElement = document.getElementById(this.alertId);
        if (alertElement) alertElement.remove();
    }

    show() {
        const alertHTML = `
            <div id="${this.alertId}" class="alert">
                <span class="alert-close" onclick="document.getElementById('${this.alertId}').remove()">&#10005;</span>
                <div class="alert-content">
                    <div class="heading">${this.heading}</div>
                    <div class="body">${this.body}</div>
                </div>
            </div>`;
        this.alertSection.insertAdjacentHTML("beforeend", alertHTML);
    }
}
