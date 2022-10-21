import { Utils } from './utils.js'

window.addEventListener('load', async function () {
  const canvas = document.querySelector('.canvas'),
    ctx = canvas.getContext('2d'),
    select = document.querySelector('.select')

  const CANVAS_WIDTH = (canvas.width = 960)
  const CANVAS_HEIGHT = (canvas.height = 536)

  const SYMBOL_WIDTH = 240
  const SYMBOL_HEIGHT = 170

  const buttonRightEdge = 930
  const buttonLeftEdge = 815
  const buttonTopEdge = 210
  const buttonBottomEdge = 325

  const images = await Utils.fetchData('data/data.json')

  let count = 0
  let isEnd = false
  let isRunning = false

  const imagesArray =
    images &&
    images.map((img) => {
      const image = new Image()
      image.src = img.src
      image.onload = () => {
        count++
        if (count === images.length) {
          const app = new App()
          app.game()
        }
      }
      return { [img.name]: image }
    })

  const imagesKeys = imagesArray.map((img) => Object.keys(img)).flat()

  const bgImg = imagesArray[imagesKeys.indexOf('bg')]['bg']
  const buttonImg = imagesArray[imagesKeys.indexOf('button')]['button']
  const disabledButtonImg = imagesArray[imagesKeys.indexOf('button_d')]['button_d']
  const betLineImage = imagesArray[imagesKeys.indexOf('bet_line')]['bet_line']

  const store = {
    background: {
      image: bgImg,
      x: 0,
      y: 0,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
    },
    spinButton: {
      image: buttonImg,
      x: 818,
      y: 212,
      width: 110,
      height: 110,
    },
    chosenSymbol: {
      image: null,
      x: 307,
      y: 0,
      width: SYMBOL_WIDTH,
      height: SYMBOL_HEIGHT,
    },
    animatedSymbols: [],
    symbolX: 551,
    betLine: {
      image: betLineImage,
      x: 343,
      y: 260,
      width: 400,
      height: 10,
    },
    frame: {
      color: 'rgba(205, 204, 205, 0.4)',
      x: CANVAS_WIDTH * 0.5 - 120,
      y: CANVAS_HEIGHT * 0.5 - 100,
      width: 250,
      height: 200,
    },
    message: {
      color: '',
      text1: '',
      text2: '',
      font: '50px san-serif',
    },
  }

  for (let i = 0; i < 3; i++) {
    let y = i * SYMBOL_HEIGHT
    const object = Utils.createImageObject(
      Utils.getRandomImage(imagesArray, imagesKeys),
      store.symbolX,
      y,
      SYMBOL_WIDTH,
      SYMBOL_HEIGHT,
    )
    store.animatedSymbols.push(object)
  }

  class App {
    game() {
      select.style.display = 'block'
      select.addEventListener('change', this.handleChangeOption)
      canvas.addEventListener('click', this.handleButtonClick)
      canvas.addEventListener('mousemove', this.handleButtonMouseMove)
      this.drawOptions()
      this.draw()
    }

    drawOptions() {
      images.forEach((image) => {
        if (
          image.name === 'button' ||
          image.name === 'button_d' ||
          image.name === 'bg' ||
          image.name === 'bet_line'
        )
          return
        const option = document.createElement('option')
        option.textContent = image.name
        select.append(option)
      })
    }

    handleChangeOption = () => {
      isEnd = false
      isRunning = false
      const option = document.querySelector('select').selectedOptions[0].textContent
      const obj = imagesArray.find((img) => img[option])
      const choice = imagesArray.indexOf(obj)
      store.chosenSymbol.image = imagesArray[choice][option]
      this.showChosenImageAnimation()
    }

    showChosenImageAnimation = () => {
      gsap.to(store.chosenSymbol, { duration: 0.5, y: 170, ease: 'elastic.out(2, 1)' })
      store.chosenSymbol.y = 0
    }

    animate = () => {
      for (let i = 0; i < store.animatedSymbols.length; i++) {
        gsap.to(store.animatedSymbols[i], {
          duration: 0.1,
          y: (i + 1) * SYMBOL_HEIGHT,
          repeat: 20,
          ease: 'none',
          onRepeat: () => this.handleRepeat(i),
          onComplete: () => this.handleComplete(i),
        })
      }
    }

    handleRepeat = (i, key = 'repeat') => {
      if (i === 0) {
        store.animatedSymbols.pop()
        const object = Utils.createImageObject(
          Utils.getRandomImage(imagesArray, imagesKeys),
          store.symbolX,
          i * SYMBOL_HEIGHT,
          SYMBOL_WIDTH,
          SYMBOL_HEIGHT,
        )
        store.animatedSymbols.unshift(object)
      } else {
        gsap.set(store.animatedSymbols[i], {
          y: i * SYMBOL_HEIGHT,
        })
      }
      if (key !== 'complete') {
        gsap.to(store.animatedSymbols[i], {
          duration: 0.1,
          y: (i + 1) * SYMBOL_HEIGHT,
          ease: 'none',
        })
      }
    }

    handleComplete = (i) => {
      if (i === 2) {
        for (let j = 0; j < store.animatedSymbols.length; j++) {
          this.handleRepeat(j, 'complete')
        }
        isEnd = true
        this.checkWinOrLoose()
        this.animateFrame()
      }
    }

    checkWinOrLoose = () => {
      if (store.chosenSymbol.image === store.animatedSymbols[1].image) {
        store.message.color = 'green'
        store.message.text1 = 'You win!!!'
        store.message.text2 = 'Well done!'
      } else {
        store.message.color = 'black'
        store.message.text1 = 'You lost :('
        store.message.text2 = 'Try Again'
      }
      store.spinButton.image = buttonImg
    }

    animateFrame = () => {
      gsap.to(store.frame, {
        duration: 1,
        x: CANVAS_WIDTH * 0.5 - 180,
        y: CANVAS_HEIGHT * 0.5 - 150,
        width: 350,
        height: 300,
        ease: 'none',
      })

      gsap.to(store.frame, {
        duration: 1,
        x: CANVAS_WIDTH * 0.5 - 120,
        y: CANVAS_HEIGHT * 0.5 - 100,
        width: 250,
        height: 200,
        delay: 0.7,
        ease: 'none',
      })
    }

    drawFrame = () => {
      ctx.textAlign = 'center'
      ctx.fillStyle = store.frame.color
      Utils.roundRect(
        ctx,
        store.frame.x,
        store.frame.y,
        store.frame.width,
        store.frame.height,
        10,
        true,
        false,
      )
      ctx.font = store.message.font
      ctx.fillStyle = store.message.color
      ctx.strokeText(store.message.text1, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5 - 30)
      ctx.strokeText(store.message.text2, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5 + 50)
      ctx.fillText(store.message.text1, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5 - 30)
      ctx.fillText(store.message.text2, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5 + 50)
    }

    draw = () => {
      requestAnimationFrame(this.draw)
      this.drawImages()
      if (isEnd) {
        this.drawFrame()
      }
    }

    drawImages = () => {
      Utils.drawImage(ctx, store.background)
      Utils.drawImage(ctx, store.spinButton)
      Utils.drawImage(ctx, store.chosenSymbol)
      if (isRunning) {
        for (let i = 0; i < store.animatedSymbols.length; i++) {
          Utils.drawImage(ctx, store.animatedSymbols[i])
        }
      }
      if (isEnd) {
        Utils.drawImage(ctx, store.betLine)
      }
    }

    handleButtonClick = (event) => {
      if (
        buttonLeftEdge <= event.offsetX &&
        buttonRightEdge >= event.offsetX &&
        buttonTopEdge <= event.offsetY &&
        event.offsetY <= buttonBottomEdge
      ) {
        isRunning = true
        isEnd = false
        this.animate()
        store.spinButton.image = disabledButtonImg
      }
    }

    handleButtonMouseMove = (event) => {
      if (
        (buttonLeftEdge <= event.offsetX &&
          buttonRightEdge >= event.offsetX &&
          buttonTopEdge <= event.offsetY &&
          event.offsetY <= buttonBottomEdge) ||
        (event.offsetX >= 430 &&
          event.offsetX <= 540 &&
          event.offsetY >= 370 &&
          event.offsetY <= 480)
      ) {
        canvas.style.cursor = 'pointer'
      } else {
        canvas.style.cursor = 'default'
      }
    }
  }
})
