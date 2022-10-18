import { fetchData } from '../service/fetchImages.js'
import { drawImage, createImageObject, getRandomImage } from './helpers/index.js'

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

  const images = await fetchData()

  let count = 0
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
        if (image.name === 'button' || image.name === 'button_d' || image.name === 'bg') return
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
      gsap.to(store.chosenSymbol, { duration: 0.5, y: 190, ease: 'elastic.out(2, 1)' })
      store.chosenSymbol.y = 0
    }

    animate = () => {
      for (let i = 0; i < 3; i++) {
        let y = i * SYMBOL_HEIGHT
        const object = createImageObject(
          getRandomImage(imagesArray, imagesKeys),
          store.symbolX,
          y,
          SYMBOL_WIDTH,
          SYMBOL_HEIGHT,
        )
        store.animatedSymbols.push(object)
      }

      const handleRepeat = () => {
        const randomImg = getRandomImage(imagesArray, imagesKeys)
        const object = createImageObject(randomImg, store.symbolX, 170, SYMBOL_WIDTH, SYMBOL_HEIGHT)
        store.animatedSymbols.unshift(object)
        store.animatedSymbols.pop()
      }
      gsap.set(store.animatedSymbols, {
        y: (i) => (i + 1) * 170,
      })

      gsap.to(store.animatedSymbols, {
        duration: 0.1,
        y: CANVAS_HEIGHT,
        repeat: 10,
        onRepeat: handleRepeat,
      })
    }

    draw = () => {
      requestAnimationFrame(this.draw)
      this.drawImages()
    }

    drawImages = () => {
      drawImage(store.background)
      drawImage(store.spinButton)
      drawImage(store.chosenSymbol)
      if (store.animatedSymbols.length) {
        for (let i = 0; i < store.animatedSymbols.length; i++) {
          drawImage(store.animatedSymbols[i])
        }
      }
    }

    handleButtonClick = (event) => {
      if (
        buttonLeftEdge <= event.offsetX &&
        buttonRightEdge >= event.offsetX &&
        buttonTopEdge <= event.offsetY &&
        event.offsetY <= buttonBottomEdge
      ) {
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
