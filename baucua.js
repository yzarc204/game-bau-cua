function BauCua(io) {
  //Khởi tạo thông tin game
  this.idPhien = 0
  this.choPhepCuoc = false
  this.player = []
  this.account = []
  this.timeDatCuoc = 15
  this.timeNghi = 5
  this.time = 0
  this.resultAbility = ['bau', 'cua', 'nai', 'ca', 'ga', 'tom']
  this.result = []

  //Bắt đầu phiên mới
  this.newGame = () => {
    //Cập nhật thông tin phiên bầu cua
    this.idPhien++
    this.choPhepCuoc = true
    this.player = []
    this.time = this.timeDatCuoc
    this.result = []

    //Vòng lặp game
    let gameLoop = setInterval(() => {
      //Lắc bầu cua
      this.generateRandomResult()
      //In ra thông tin phiên bầu cua
      console.log('ID phiên:', this.idPhien)
      console.log('Thời gian đặt cược:', this.time)
      console.log('Số người online:', this.account.length)
      console.log('Tổng số người đặt cược:', this.player.length)
      console.log('Kết quả đang lắc:', this.result)
      //Gửi về client
      let gameInfo = {
        id: this.idPhien,
        time: this.time
      }
      io.sockets.emit('gameInfo', gameInfo)
      //Trừ thời gian và kiểm tra
      this.time--
      if (this.time <= 0) {
        clearInterval(gameLoop)
        this.sendResult()
      }
    }, 1000)
  }

  //Gửi kết quả
  this.sendResult = () => {
    console.log('Kết quả của phiên', this.idPhien, ':', this.result)
    this.choPhepCuoc = false
    //Gửi về client
    let gameResult = {
      result: this.result
    }
    io.sockets.emit('gameResult', gameResult)
    //Kết thúc game
    setTimeout(() => {
      this.gameOver()
    }, 3000)
  }

  //Gửi tiền cho người thắng
  this.sendMoneyToWinPlayer = () => {
    this.player.forEach(player => {
      //Tính toán số tiền thắng của player hiện tại
      let totalWinMoney = 0
      this.result.forEach(animal => {
        if (player.hasOwnProperty(animal)) {
          totalWinMoney += player[animal]
        }
      })
      if (totalWinMoney > 0) {
        //Cộng tiền vào tài khoản người thắng
        let account = this.account.find(x => x.id == player.id)
        account.money += totalWinMoney * 2
        //Gửi tiền thắng về client
        this.getAccountMoney(player.id)
        io.to(player.id).emit('ganeWin', { money: totalWinMoney })
      }
    })
  }

  //Kết phúc phiên
  this.gameOver = () => {
    this.sendMoneyToWinPlayer()
    this.time = this.timeNghi
    //Vòng lặp nghỉ
    let waitLoop = setInterval(() => {
      //Gửi về client
      let gameOver = {
        time: this.time
      }
      io.sockets.emit('gameOver', gameOver)
      //Trừ thời gian và kiểm tra
      this.time--
      if (this.time <= 0) {
        clearInterval(waitLoop)
        this.newGame()
      }
    }, 1000)
  }

  //Đặt cược
  this.putMoney = (playerId, animal, money) => {
    //Phiên đấu chưa bắt đầu
    if (!this.choPhepCuoc) {
      io.to(playerId).emit('putMoney', { status: false, msg: 'Phiên đấu chưa bắt đầu' })
      return
    }
    //Tài khoản hết tiền
    let account = this.account.find(x => x.id == playerId)
    if (account.money < money) {
      io.to(playerId).emit('putMoney', { status: false, msg: 'Tiền trong tài khoản không đủ' })
      return
    }
    //Thêm tiền cược
    let player = this.player.find(x => x.id == playerId)
    //Nếu player đã đặt cược
    if (player) {
      if (player.hasOwnProperty(animal)) {
        player[animal] += money
      } else {
        player[animal] = money
      }
    } else {
      let newPlayer = { id: playerId }
      newPlayer[animal] = money
      this.player.push(newPlayer)
    }
    account.money -= money //Trừ tiền
    this.getAccountMoney(playerId)
    io.to(playerId).emit('putMoney', { status: true, animal: animal, money: money })
  }

  //Random kết quả bầu cua
  this.generateRandomResult = () => {
    //Sắp xếp mảng ngẫu nhiên
    for (let i = 0; i < 6; i++) {
      let j = Math.floor(Math.random() * 5)
      let temp = this.resultAbility[i]
      this.resultAbility[i] = this.resultAbility[j]
      this.resultAbility[j] = temp
    }
    //Lấy kết quả random
    this.result = []
    for (let i = 0; i < 3; i++) {
      let index = Math.floor(Math.random() * 5)
      let animal = this.resultAbility[index]
      this.result.push(animal)
    }
  }

  //Thêm account
  this.addAccount = (playerId) => {
    let account = this.account.find(x => x.id == playerId)
    if (!account) {
      let accountInfo = { id: playerId, money: 100000 }
      this.account.push(accountInfo)
    }
  }

  //Xoá account 
  this.deleteAccount = (playerId) => {
    let account = this.account.find(x => x.id == playerId)
    let accIdx = this.account.indexOf(account)
    this.account.splice(accIdx, 1)
  }

  //Lấy tổng tiền trong tài khoản
  this.getAccountMoney = (playerId) => {
    let account = this.account.find(x => x.id == playerId)
    io.to(playerId).emit('account', { money: account.money })
  }
}

module.exports = BauCua