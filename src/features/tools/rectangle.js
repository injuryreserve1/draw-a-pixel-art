export function rectangle(pos, editor) {
  const initialPixels = [...editor.canvas.pixels];

  function drawRectangle(end) {
    editor.canvas.pixels = [...initialPixels];
    editor.canvas.render();

    let xStart = Math.min(pos.x, end.x);
    let yStart = Math.min(pos.y, end.y);
    let xEnd = Math.max(pos.x, end.x);
    let yEnd = Math.max(pos.y, end.y);

    let drawn = [];
    for (let y = yStart; y <= yEnd; y++) {
      for (let x = xStart; x <= xEnd; x++) {
        drawn.push({ x, y, color: editor.state.color });
      }
    }
    editor.draw(drawn);
  }

  drawRectangle(pos);

  return drawRectangle;
}
