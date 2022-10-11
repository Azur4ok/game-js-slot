import { fetchData } from '../service/fetchImages.js';

window.addEventListener('load', async function () {
  const canvas = document.querySelector('.canvas'),
    button = document.querySelector('.btn'),
    select = this.document.querySelector('.select'),
    ctx = canvas.getContext('2d');

  const CANVAS_WIDTH = (canvas.width = 300);
  const CANVAS_HEIGHT = (canvas.height = 250);

  const images = await fetchData();

  const startDate = String(new Date()).split(' ')[4].split(':')[2];
  const image = new Image();
  console.log(startDate);

  function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    image.src = images[Math.floor(Math.random() * images.length)].src;
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    requestAnimationFrame(animate);
  }

  function drawImage() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const option = document.querySelector('select').selectedOptions[0].textContent;
    const index = images.findIndex((img) => img.name === option);
    image.src = images[index].src;

    return ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  class App {
    static main() {
      this.drawOptions();

      button.addEventListener('click', () => {
        button.style.background = 'url("./img/BTN_Spin_d.png") no-repeat';
        button.style.backgroundSize = 100 + '%';
        button.ariaDisabled = true;
        animate()
      });
      select.addEventListener('change', drawImage);
    }

    static drawOptions() {
      images.forEach((image) => {
        const option = document.createElement('option');
        option.textContent = image.name;
        select.append(option);
      });
    }
  }

  App.main();
});
