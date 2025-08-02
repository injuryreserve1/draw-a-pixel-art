export class ColorPicker {
  constructor(state) {
    this.element = document.querySelector(".palette");
    this.input = document.querySelector(".range");
    this.colorVisualization = document.querySelector(".color");
    this.ctx = this.element.getContext("2d", { willReadFrequently: true });
    this.onInput({ target: { value: 0 } }); // init color
    this.input.addEventListener("input", (e) => this.onInput(e));
    this.element.addEventListener("click", (e) => {
      state.color = this.onClick(e);
      this.colorVisualization.style.backgroundColor = state.color;
    });
  }

  onClick(e) {
    let x = e.offsetX;
    let y = e.offsetY;
    let pixel = this.ctx.getImageData(x, y, 1, 1)["data"];
    let rgb = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
    // console.log(rgb);
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
