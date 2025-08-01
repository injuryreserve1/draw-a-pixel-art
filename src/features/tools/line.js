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

export function line(pos, editor) {
  const initialPixels = [...editor.canvas.pixels];
  return (end) => {
    // let line = drawLine(pos, end, editor.state.color);
    // editor.draw(line);
    editor.canvas.pixels = [...initialPixels];
    editor.canvas.render();

    // Рисуем новую линию
    const linePixels = drawLine(pos, end, editor.state.color);
    editor.draw(linePixels);
  };
}
