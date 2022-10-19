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
}
