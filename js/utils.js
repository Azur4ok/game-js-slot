export class Utils {
  static fetchData = async (path) => {
    const response = await fetch(path)
    return await response.json()
  }

  static getRandomImage = (images, keys) => {
    const randomIndex = Math.floor(Math.random() * 6)
    return images[randomIndex][keys[randomIndex]]
  }

  static drawImage = (ctx, imageObject) => {
    if (imageObject.image) {
      ctx.drawImage(
        imageObject.image,
        imageObject.x,
        imageObject.y,
        imageObject.width,
        imageObject.height,
      )
    }
  }

  static createImageObject = (image, x, y = 0, width, height) => {
    return {
      image,
      x,
      y,
      width,
      height,
    }
  }

  static roundRect = (ctx, x, y, width, height, radius = 5, fill = false, stroke = true) => {
    if (typeof radius === 'number') {
      radius = { tl: radius, tr: radius, br: radius, bl: radius }
    } else {
      radius = { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, ...radius }
    }
    ctx.beginPath()
    ctx.moveTo(x + radius.tl, y)
    ctx.lineTo(x + width - radius.tr, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
    ctx.lineTo(x + width, y + height - radius.br)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height)
    ctx.lineTo(x + radius.bl, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
    ctx.lineTo(x, y + radius.tl)
    ctx.quadraticCurveTo(x, y, x + radius.tl, y)
    ctx.closePath()
    if (fill) {
      ctx.fill()
    }
    if (stroke) {
      ctx.stroke()
    }
  }
}
