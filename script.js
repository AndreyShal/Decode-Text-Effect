let canvas;
let ctx;
let flowField;
let flowFieldAnimation;
window.addEventListener("load", function () {
  canvas = document.getElementById("canvas1");
  ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  flowField = new FlowFieledEffect(ctx, canvas.width, canvas.height);
  flowField.animate(0);
});

window.addEventListener("resize", function () {
  cancelAnimationFrame(flowFieldAnimation);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  flowField = new FlowFieledEffect(ctx, canvas.width, canvas.height);
  flowField.animate(0);
});

const mouse = {
  x: 0,
  y: 0,
};
window.addEventListener("mousemove", function (e) {
  mouse.x = e.x;
  mouse.y = e.y;
});

class FlowFieledEffect {
  #ctx;
  #width;
  #height;
  constructor(ctx, width, height) {
    this.#ctx = ctx;
    this.#ctx.lineWidth = 1;
    this.#width = width;
    this.#height = height;
    this.lastTime = 0;
    this.interval = 1000 / 60;
    this.timer = 0;
    this.cellSize = 50;
    // this.gradient;
    // this.#createGradient();
    // this.#ctx.strokeStyle = this.gradient;
    this.#ctx.strokeStyle = "white";
    this.radius = 0;
    this.vr = 0.06;
  }
  // #createGradient() {
  //   this.gradient = this.#ctx.createLinearGradient(0, 0, this.#width, this.#height);
  //   this.gradient.addColorStop("0.1", "#ff5c33");
  //   this.gradient.addColorStop("0.2", "#ff66b3");
  //   this.gradient.addColorStop("0.3", "#ccccff");
  //   this.gradient.addColorStop("0.4", "#b3ffff");
  //   this.gradient.addColorStop("0.5", "#80ff80");
  //   this.gradient.addColorStop("0.6", "#ffff33");
  // }
  #drawLine(angle, x, y) {
    let positionX = x;
    let positionY = y;
    let dx = mouse.x - positionX;
    let dy = mouse.y - positionY;
    let distance = dx * dx + dy * dy;
    if (distance > 200000) distance = 400000;
    else if (distance < 200000) {
      distance = 600000;
    }
    let length = distance / 50000;
    this.#ctx.beginPath();
    this.#ctx.moveTo(x, y);
    this.#ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    this.#ctx.lineTo(x + Math.cos(angle) * -length, y + Math.sin(angle) * -length);
    this.#ctx.stroke();
    this.#ctx.stroke();
    this.#ctx.stroke();
  }
  animate(timeStamp) {
    const deltaTime = timeStamp - this.lastTime;
    this.lastTime = timeStamp;
    if (this.timer > this.interval) {
      this.#ctx.clearRect(0, 0, this.#width, this.#height);
      this.radius += this.vr;
      if (this.radius > 5 || this.radius < -5) this.vr *= -1;

      for (let y = 0; y < this.#height; y += this.cellSize / 1.5) {
        for (let x = 0; x < this.#width; x += this.cellSize) {
          const angle = (Math.cos(x * 0.001) + Math.sin(y * 0.001)) * this.radius;
          this.#drawLine(angle, x, y);
        }
      }

      this.timer = 0;
    } else {
      this.timer += deltaTime;
    }

    flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));
  }
}
