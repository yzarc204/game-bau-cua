class Account {
    constructor(id, money) {
        this.id = id
        this.money = money
    }

    addMoney(money) {
        this.money += money
    }

    subtractMoney(money) {
        this.money -= money
    }
}

module.exports = Account