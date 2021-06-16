class Player {
    constructor(id) {
        this.id = id
        this.choices = {}
    }

    putMoney(animal, money) {
        if (this.choices.hasOwnProperty(animal)) {
            this.choices[animal] += money
        } else {
            this.choices[animal] = money
        }
    }
}

module.exports = Player