export const scale = 20; // hardcoded scale :/

export function mousePosition(canvas, pos) {
  //1 option
  return {
    x: Math.floor(pos.offsetX / scale),
    y: Math.floor(pos.offsetY / scale),
  };
  // or 2 option
  /*
   let { left, top } = canvas.getBoundingClientRect();
  return {
    x: Math.floor(pos.clientX - left / scale),
    y: Math.floor(pos.clientY - top / scale),
  };
*/
}

export class Canvas {
  constructor(state) {
    this.element = document.querySelector(".canvas");
    this.width = this.element.width / scale;
    this.height = this.element.height / scale;
    this.pixels = new Array(Math.floor(this.width * this.height)).fill(
      state.backgroundColor
    );
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
