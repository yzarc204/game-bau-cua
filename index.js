//Express app
const express = require('express')
const app = express()
app.use('/', express.static(__dirname + '/www'))
//HTTP server
const http = require('http')
const server = http.createServer(app)
//Socket
const { Server } = require('socket.io')
const io = new Server(server)
//Bau Cua
const BauCua = require('./game/baucua')

/* ========== MAIN ========== */
let game = new BauCua(io)
game.newGame()

app.get('/', (req, res) => {
  res.sendFile('index.html')
})

server.listen(8080, () => {
  console.log('Server is listening on port 8080')
})

io.on('connect', socket => {
  //Thêm tài khoản khi kết nối vào game
  game.addAccount(socket.id)
  game.getAccountMoney(socket.id)

  //Đặt cược
  socket.on('putMoney', putMoneyData => {
    let money = putMoneyData['money']
    let animal = putMoneyData['animal']
    game.putMoney(socket.id, animal, money)
  })

  //Xoá tài khoản khi rời khỏi game
  socket.on('disconnect', () => {
    game.deleteAccount(socket.id)
  })
})