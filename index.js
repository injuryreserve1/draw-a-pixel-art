const scale = 20;

function mousePosition(canvas, pos) {
  let { left, top } = canvas.getBoundingClientRect();
  return {
    x: Math.floor((pos.clientX - left) / scale),
    y: Math.floor((pos.clientY - top) / scale),
  };
}

function drawLine(from, to, color) {
  let points = [];
  if (Math.abs(from.x - to.x) > Math.abs(from.y - to.y)) {
    if (from.x > to.x) [from, to] = [to, from];
    let slope = (to.y - from.y) / (to.x - from.x);
    for (let { x, y } = from; x <= to.x; x++) {
      points.push({ x, y: Math.round(y), color });
      y += slope;
    }
  } else {
    if (from.y > to.y) [from, to] = [to, from];
    let slope = (to.x - from.x) / (to.y - from.y);
    for (let { x, y } = from; y <= to.y; y++) {
      points.push({ x: Math.round(x), y, color });
      x += slope;
    }
  }
  return points;
}

const around = [
  { dx: -1, dy: 0 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: -1 },
  { dx: 0, dy: 1 },
];

class Canvas {
  constructor() {
    this.element = document.querySelector(".canvas");
    this.width = this.element.width / scale;
    this.height = this.element.height / scale;
    this.pixels = new Array(Math.floor(this.width * this.height)).fill("white");
  }

  pixel(x, y) {
    return this.pixels[x + y * this.width];
  }

  render() {
    let ctx = this.element.getContext("2d");
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        ctx.fillStyle = this.pixel(x, y);
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }
}

class Tools {
  constructor() {
    this.element = document.querySelectorAll(".tool");
    this.setActive({ target: { id: 0 } });
    this.currentTool = 0;
  }

  setActive(e) {
    this.element.forEach((el) => el.classList.remove("active"));
    this.element[e.target.id].classList.add("active");
    this.currentTool = e.target.id;
  }
}

class ColorPicker {
  constructor() {
    this.element = document.querySelector(".palette");
    this.input = document.querySelector(".range");
    this.ctx = this.element.getContext("2d", { willReadFrequently: true });
    this.input.addEventListener("input", (e) => this.onInput(e));
    this.onInput({ target: { value: 0 } });
  }

  onClick(e) {
    let x = e.offsetX;
    let y = e.offsetY;
    let pixel = this.ctx.getImageData(x, y, 1, 1)["data"];
    let rgb = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
    return rgb;
  }

  onInput(e) {
    let color = `hsl(${e.target.value},100%,50%)`;
    let gradientH = this.ctx.createLinearGradient(
      0,
      0,
      this.ctx.canvas.width,
      0
    );
    gradientH.addColorStop(0, "#fff");
    gradientH.addColorStop(1, color);
    this.ctx.fillStyle = gradientH;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    let gradientV = this.ctx.createLinearGradient(0, 0, 0, 300);
    gradientV.addColorStop(0, "rgba(0,0,0,0)");
    gradientV.addColorStop(1, "#000");
    this.ctx.fillStyle = gradientV;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }
}

class Editor {
  #tools = [
    this.pen,
    this.fill,
    this.rectangle,
    this.eraser,
    this.circle,
    this.line,
  ];
  constructor() {
    this.canvas = new Canvas();
    this.colorPicker = new ColorPicker();
    this.tools = new Tools();
    this.tool = this.#tools[0];
    this.color = "rgb(0,0,0)";
    this.canvas.element.addEventListener("mousedown", (e) => this.mouse(e));
    this.colorPicker.element.addEventListener("click", (e) => {
      this.color = this.colorPicker.onClick(e);
    });
    this.tools.element.forEach((el) => {
      el.addEventListener("click", (e) => {
        this.tools.setActive(e);
        this.tool = this.#tools[e.target.id];
      });
    });
  }

  draw(pixels) {
    let copy = [...this.canvas.pixels];
    for (let { x, y, color } of pixels) {
      copy[x + y * this.canvas.width] = color;
    }
    this.canvas.pixels = copy;
    this.canvas.render();
  }

  mouse(e) {
    if (e.button != 0) return;
    let pos = mousePosition(this.canvas.element, e);
    let callback = this.tool(pos);
    if (!callback) return;
    let move = (moveEvent) => {
      if (moveEvent.buttons == 0) {
        this.canvas.element.removeEventListener("mousemove", move);
      } else {
        let newPos = mousePosition(this.canvas.element, moveEvent);
        if (newPos.x == pos.x && newPos.y == pos.y) return;
        pos = newPos;
        callback(newPos);
      }
    };
    this.canvas.element.addEventListener("mousemove", move);
  }

  pen(pos) {
    function drawPixel({ x, y }) {
      let points = { x, y, color: this.color };
      this.draw([points]);
    }
    const boundDrawPixel = drawPixel.bind(this);
    boundDrawPixel(pos);
    return boundDrawPixel;
  }

  fill(pos) {
    let { x, y } = pos;
    let targetColor = this.canvas.pixel(x, y);
    let points = [{ x, y, color: this.color }];
    for (let done = 0; done < points.length; done++) {
      for (let { dx, dy } of around) {
        let x = points[done].x + dx,
          y = points[done].y + dy;
        if (
          x >= 0 &&
          x < this.canvas.width &&
          y >= 0 &&
          y < this.canvas.height &&
          this.canvas.pixel(x, y) == targetColor &&
          !points.some((p) => p.x == x && p.y == y)
        ) {
          points.push({ x, y, color: this.color });
        }
      }
    }
    this.draw(points);
  }

  rectangle(pos) {
    function drawRectangle(end) {
      let xStart = Math.min(pos.x, end.x);
      let yStart = Math.min(pos.y, end.y);
      let xEnd = Math.max(pos.x, end.x);
      let yEnd = Math.max(pos.y, end.y);
      let drawn = [];
      for (let y = yStart; y <= yEnd; y++) {
        for (let x = xStart; x <= xEnd; x++) {
          drawn.push({ x, y, color: this.color });
        }
      }
      this.draw(drawn);
    }
    const binded = drawRectangle.bind(this);
    binded(pos);
    return binded;
  }

  eraser(pos) {
    function drawPixel({ x, y }) {
      let points = { x, y, color: "white" };
      this.draw([points]);
    }
    const boundDrawPixel = drawPixel.bind(this);
    boundDrawPixel(pos);
    return boundDrawPixel;
  }

  circle(pos) {
    function drawCircle(to) {
      let radius = Math.sqrt(
        Math.pow(to.x - pos.x, 2) + Math.pow(to.y - pos.y, 2)
      );
      let radiusC = Math.ceil(radius);
      let points = [];
      for (let dy = -radiusC; dy <= radiusC; dy++) {
        for (let dx = -radiusC; dx <= radiusC; dx++) {
          let dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
          if (dist > radius) continue;
          let y = pos.y + dy,
            x = pos.x + dx;
          if (
            y < 0 ||
            y >= this.canvas.height ||
            x < 0 ||
            x >= this.canvas.width
          )
            continue;
          points.push({ x, y, color: this.color });
        }
      }
      this.draw(points);
    }
    const binded = drawCircle.bind(this);
    binded(pos);
    return binded;
  }

  line(pos) {
    console.log("not working :\\");
  }
}

let entry = new Editor();
