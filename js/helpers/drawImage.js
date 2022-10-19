const canvas = document.querySelector('.canvas'),
  ctx = canvas.getContext('2d')

export const drawImage = (imageObject) => {
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
