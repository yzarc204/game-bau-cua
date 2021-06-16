class WinAnimalOverlay {
    constructor(x, y, parent) {
        this.x = x
        this.y = y
        this.parent = parent

        this.styleDiv()
        this.hideDiv()
        this.renderDiv()
    }

    styleDiv() {
        this.div = document.createElement('div')
        this.div.className = 'win-animal'
        this.div.style.left = this.x + 'px'
        this.div.style.top = this.y + 'px'
    }

    hideDiv() {
        this.div.style.opacity = 0
    }

    renderDiv() {
        this.parent.appendChild(this.div)
    }
}