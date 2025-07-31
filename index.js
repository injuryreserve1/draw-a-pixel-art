import { Editor } from "./src/Editor.js";
export const scale = 20;

const around = [
  { dx: -1, dy: 0 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: -1 },
  { dx: 0, dy: 1 },
];

function pen(pos, editor) {
  function drawPixel({ x, y }) {
    let points = { x, y, color: editor.state.color };
    editor.draw([points]);
  }
  const boundDrawPixel = drawPixel.bind(this);
  boundDrawPixel(pos);
  return boundDrawPixel;
}

function fill(pos, editor, canvas) {
  let { x, y } = pos;
  let targetColor = canvas.pixel(x, y);
  let points = [{ x, y, color: editor.state.color }];
  for (let done = 0; done < points.length; done++) {
    for (let { dx, dy } of around) {
      let x = points[done].x + dx,
        y = points[done].y + dy;
      if (
        x >= 0 &&
        x < canvas.width &&
        y >= 0 &&
        y < canvas.height &&
        canvas.pixel(x, y) == targetColor &&
        !points.some((p) => p.x == x && p.y == y)
      ) {
        points.push({ x, y, color: editor.state.color });
      }
    }
  }
  editor.draw(points);
}

function rectangle(pos, editor) {
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

function eraser(pos, editor) {
  function drawPixel({ x, y }) {
    let points = { x, y, color: "white" };
    editor.draw([points]);
  }
  const boundDrawPixel = drawPixel.bind(this);
  boundDrawPixel(pos);
  return boundDrawPixel;
}

function circle(pos, editor, canvas) {
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
        if (y < 0 || y >= canvas.height || x < 0 || x >= canvas.width) continue;
        points.push({ x, y, color: editor.state.color });
      }
    }
    editor.draw(points);
  }
  const binded = drawCircle.bind(this);
  binded(pos);
  return binded;
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

function line(pos, editor) {
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
const tools = [pen, fill, rectangle, eraser, circle, line];

const entryState = {
  color: "black",
  backgroundColor: "white",
  tools: tools,
  currentTool: 0,
};
let editor = new Editor(entryState);
