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