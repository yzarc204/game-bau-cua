class AddedMoney {
    constructor(x, y, money, parent) {
        this.x = x
        this.y = y
        this.money = money
        this.parent = parent

        this.styleDiv()
        this.renderDiv()
    }

    styleDiv() {
        this.div = document.createElement('div')
        this.div.className = 'added-money'
        this.div.style.background = `url('./assets/Money/${this.money / 1000}k.png')`
        this.div.style.left = this.x + 'px'
        this.div.style.top = this.y + 'px'
    }

    renderDiv() {
        this.parent.appendChild(this.div)
    }
}