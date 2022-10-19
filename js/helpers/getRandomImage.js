export const getRandomImage = (images, keys) => {
    const randomIndex = Math.floor(Math.random() * 6);
    return images[randomIndex][keys[randomIndex]]
}