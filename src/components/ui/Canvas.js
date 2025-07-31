import { scale } from "../../../index.js";

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
