const socket = io()
/* ========== ELEMENT ========= */

const board = document.querySelector('#board')
const accountMoney = document.querySelector('#account-money')
const bowl = document.querySelector('#bowl')
const disk = document.querySelector('#disk')
const cubes = document.querySelectorAll('.cube')
const time = document.querySelector('#time')
const win = document.querySelector('#win')
const animalBtns = document.querySelectorAll('.animal')
const moneyBtns = document.querySelectorAll('.money')

/* ========== VARIABLE AND CONSTANT ========= */

//Money button
let currentMoneyBtn = moneyBtns.item(0)
// Shake
let shakeLoop = null
let shakeDirection = -1
const SHAKE_DISTANCE = 50
let shakeSound = new Audio('./assets/Sound/diceshake.mp3')
shakeSound.volume = 1
let shakeSoundLoop = null
//Win audio
let winAudio = new Audio('./assets/Sound/win.mp3')
winAudio.volume = 1

/* ========== FUNCTION ========= */
function FindAnimalButtonInNodeList(btnList, animalName) {
  for (let i = 0; i < btnList.length; i++) {
    let btn = btnList.item(i)
    if (btn.getAttribute('data-animal-name') == animalName)
      return btn
  }
}

function DeleteAddedMoney() {
  let addedMoneys = document.querySelectorAll('.added-money')
  addedMoneys.forEach(removedMoney => {
    board.removeChild(removedMoney)
  })
}

function RenderWinAnimalOverlay(winAnimals) {
  winAnimals.forEach(animal => {
    let animalBtn = document.querySelector('#' + animal)
    let x = animalBtn.offsetLeft
    let y = animalBtn.offsetTop
    let overlay = new WinAnimalOverlay(x, y, board)
  })
}

function DeleteWinAnimal() {
  let winAnimals = document.querySelectorAll('.win-animal')
  winAnimals.forEach(winAnimal => {
    board.removeChild(winAnimal)
  })
}

function ResizeBoardToFitHeight() {
  //Tính tỉ lệ chiều cao
  let boardHeight = board.clientHeight
  let hRatio = (window.innerHeight / boardHeight)
  //Tính tỉ lệ chiều rộng
  let boardWidth = board.clientWidth
  let wRatio = (window.innerWidth / boardWidth)
  //So sánh ratio
  let ratio = (wRatio < hRatio) ? wRatio : hRatio
  //Resize
  board.style.transform = `translate(-50%, -50%) scale(${ratio})`
}

/* ========== EVENT ========= */

animalBtns.forEach(animalBtn => {
  animalBtn.addEventListener('click', e => {
    let animal = animalBtn.getAttribute('data-animal-name')
    let money = parseInt(currentMoneyBtn.getAttribute('data-money-value'))
    socket.emit('putMoney', { animal: animal, money: money })
  })
})

moneyBtns.forEach(moneyBtn => {
  moneyBtn.addEventListener('click', e => {
    currentMoneyBtn.style.top = '29px'
    currentMoneyBtn = moneyBtn
    moneyBtn.style.top = '40px'
  })
})

ResizeBoardToFitHeight()

/* ========== SOCKET ========= */

socket.on('putMoney', data => {
  if (data.status) {
    let animalBtn = FindAnimalButtonInNodeList(animalBtns, data.animal)
    let x = animalBtn.offsetLeft + Math.floor(Math.random() * 60)
    let y = animalBtn.offsetTop + Math.floor(Math.random() * 60)
    let addedMoney = new AddedMoney(x, y, data.money, board)
  } else {
    alert(data.msg)
  }
})

socket.on('gameInfo', data => {
  //Ẩn bát đĩa và xúc sắc, ẩn win
  disk.style.opacity = 0
  cubes.forEach(cube => {
    cube.style.opacity = 0
  })
  win.style.opacity = 0
  DeleteWinAnimal()
  //Hiển thị thời gian
  time.style.opacity = 1
  let strTime = String(data.time)
  strTime = (strTime.length == 1) ? '0' + strTime : strTime;
  time.innerHTML = strTime
})

socket.on('gameResult', data => {
  //Timeount 1s vì server emit 2 thông tin về 1 lúc => gameInfo và gameResult
  setTimeout(() => {
    //Ẩn thời gian, hiện bát đĩa
    time.style.opacity = 0
    disk.style.opacity = 1
    bowl.style.opacity = 1
    //Lấy kết quả
    let result = data.result
    for (let i = 0; i < 3; i++) {
      cubes.item(i).style.background = `url(./assets/Board/${result[i]}Cube.png)`
    }
    RenderWinAnimalOverlay(result)
    //Âm thanh xóc đĩa
    shakeSoundLoop = setInterval(() => {
      shakeSound.play()
    }, 1000)
    //Xóc đĩa
    shakeLoop = setInterval(() => {
      if (shakeDirection == 1) {
        bowl.style.top = '46px'
        disk.style.top = '67px'
      } else {
        bowl.style.top = '96px'
        disk.style.top = '117px'
      }
      //Đảo chiều lắc
      shakeDirection *= -1
    }, 100)
  }, 1000)
})

socket.on('gameOver', data => {
  //Ngừng lắc đĩa, đưa bát đĩa về vị trí cũ
  clearInterval(shakeLoop)
  clearInterval(shakeSoundLoop)
  disk.style.top = '117px'
  bowl.style.top = '96px'
  //Hiển thị kết quả
  cubes.forEach(cube => {
    cube.style.opacity = 1
  })
  //Mở bát
  bowl.style.opacity = 0
  //Hiển thị con vật thắng
  document.querySelectorAll('.win-animal').forEach((winAninal) => {
    winAninal.style.opacity = 1
  })
  //Xoá tiền
  DeleteAddedMoney()
})

socket.on('ganeWin', data => {
  setTimeout(() => {
    win.style.opacity = 1
    winAudio.play()
  }, 3000)
})

socket.on('account', data => {
  //Hiển thị tiền trong tài khoản
  let money = data.money
  let strMoney = money.toLocaleString('en-US', { style: 'currency', 'currency': 'USD', minimumFractionDigits: 0 })
  accountMoney.innerHTML = strMoney
})