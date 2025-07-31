import { mousePosition } from "./features/mousePosition.js";

import { Canvas, Tools, ColorPicker } from "./components/index.js";

export class Editor {
  constructor(state) {
    this.undoButton = document.getElementById("undo-btn");
    this.state = state;
    this.canvas = new Canvas(this.state);
    this.colorPicker = new ColorPicker(this.state);
    this.tools = new Tools(this.state);
    this.canvas.element.addEventListener("mousedown", (e) => this.mouse(e));
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
    if (e.button !== 0) return;

    const pos = mousePosition(this.canvas.element, e);
    const toolFunc = this.state.tools[this.state.currentTool](
      pos,
      this,
      this.canvas
    );
    if (!toolFunc) return;

    const handleMove = (e) => {
      if (e.buttons === 0) {
        this.canvas.element.removeEventListener("mousemove", handleMove);
        return;
      }
      const newPos = mousePosition(this.canvas.element, e);
      toolFunc(newPos);
    };

    const handleUp = () => {
      this.canvas.element.removeEventListener("mousemove", handleMove);
      this.canvas.element.removeEventListener("mouseup", handleUp);
    };

    this.canvas.element.addEventListener("mousemove", handleMove);
    this.canvas.element.addEventListener("mouseup", handleUp);
  }
}
