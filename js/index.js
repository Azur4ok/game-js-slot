import { fetchData } from '../service/fetchImages.js'

window.addEventListener('load', async function () {
  const canvas = document.querySelector('.canvas'),
    ctx = canvas.getContext('2d'),
    select = this.document.querySelector('.select')

  const CANVAS_WIDTH = (canvas.width = 960)
  const CANVAS_HEIGHT = (canvas.height = 536)

  const images = await fetchData()

  const imagesArray =
    images &&
    images.map((img) => {
      const image = new Image()
      image.src = img.src
      return { [img.name]: image }
    })
  const imagesKeys = imagesArray.map((img) => Object.keys(img)).flat()
  const bgImg = imagesKeys.indexOf('bg')
  const button = imagesKeys.indexOf('button') 
  const buttonD = imagesKeys.indexOf('button_d') 
  console.log(imagesArray);

  class App {
    randomImg = null
    choice = null
    image = null
    y = 0

    game() {
      select.style.display = 'block'
      select.addEventListener('change', this.drawImage)
      this.drawOptions()
      imagesArray[bgImg].bg.onload = () => {
        ctx.drawImage(imagesArray[bgImg].bg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      }
    }

    drawOptions() {
      images.forEach((image) => {
        if (image.name === 'button' || image.name === 'button_d' || image.name === 'bg') return
        const option = document.createElement('option')
        option.textContent = image.name
        select.append(option)
      })
    }

    drawImage = () => {
      const option = document.querySelector('select').selectedOptions[0].textContent
      const obj = imagesArray.find((img) => img[option])
      this.choice = imagesArray.indexOf(obj)
      this.image = imagesArray[this.choice][option]
      this.showImage()
      this.animate()
    }

    showImage = () => {
      ctx.clearRect(350, 200, 240, 170)
      ctx.strokeRect(350, 200, 240, 170)
      ctx.drawImage(this.image, 350, 200, 240, this.y)
      if (this.y >= 170) {
        this.y = 0
        return null
      }
      this.y += 10
      requestAnimationFrame(this.showImage)
    }

    animate = (timestamp) => {
      this.randomImg = Math.floor(Math.random() * 6)
      console.log(this.randomImg);
      const randomKey = imagesKeys[this.randomImg]
      this.image = imagesArray[this.randomImg][randomKey]
      console.log(this.choice, this.randomImg);
      if (timestamp >= 3500) return

      requestAnimationFrame(this.showImage)

      this.showImage()
      setTimeout(() => {
        requestAnimationFrame(this.animate)
      }, 250)
    }

    drawButton = () => {

    }

  }

  const app = new App()
  app.game()
})
