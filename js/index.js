import { Utils } from './utils.js'

window.addEventListener('load', async function () {
  const canvas = document.querySelector('.canvas'),
    ctx = canvas.getContext('2d'),
    select = this.document.querySelector('.select')

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
  let isRunning = false
  const imagesArray =
    images &&
    images.map((img) => {
      const image = new Image()
      image.src = img.src
      image.onload = () => {
        count++
        if (count === images.length) {
          console.log('h')
          const app = new App()
          app.game()
        }
      }
      return { [img.name]: image }
    })
  const imagesKeys = imagesArray.map((img) => Object.keys(img)).flat()

  const bgImgIndx = imagesKeys.indexOf('bg')
  const bgImg = imagesArray[bgImgIndx][imagesKeys[bgImgIndx]]

  const buttonIndex = imagesKeys.indexOf('button')
  const buttonImg = imagesArray[buttonIndex]['button']
  const disabledButtonImg = imagesArray[imagesKeys.indexOf('button_d')]['button_d']

  const betLineImage = imagesArray[imagesKeys.indexOf('bet_line')]['bet_line']
  let isEnd = false

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
        const handleRepeat = () => {
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
            gsap.set(store.animatedSymbols[i], {
              y: i * SYMBOL_HEIGHT,
            })
            gsap.to(store.animatedSymbols[i], {
              duration: 0.1,
              y: (i + 1) * SYMBOL_HEIGHT,
              onRepeat: handleRepeat,
            })
          } else {
            gsap.set(store.animatedSymbols[i], {
              y: i * SYMBOL_HEIGHT,
            })
            gsap.to(store.animatedSymbols[i], {
              duration: 0.1,
              repeat: 10,
              y: (i + 1) * SYMBOL_HEIGHT,
              onRepeat: handleRepeat,
            })
          }
        }
        gsap.set(store.animatedSymbols[i], {
          y: i * SYMBOL_HEIGHT,
        })

        gsap.to(store.animatedSymbols[i], {
          duration: 0.1,
          y: (i + 1) * SYMBOL_HEIGHT,
          repeat: 10,
          onRepeat: handleRepeat,
          onComplete: this.handleComplete,
        })
      }
    }

    handleComplete = () => {
      isEnd = true
    }

    draw = () => {
      requestAnimationFrame(this.draw)
      this.drawImages()
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
        this.animate()
        store.spinButton.image = disabledButtonImg
      }
    }

    handleButtonMouseMove = (event) => {
      if (
        buttonLeftEdge <= event.offsetX &&
        buttonRightEdge >= event.offsetX &&
        buttonTopEdge <= event.offsetY &&
        event.offsetY <= buttonBottomEdge
      ) {
        canvas.style.cursor = 'pointer'
      } else {
        canvas.style.cursor = 'default'
      }
    }
  }
})
