import { scale } from "./../index";

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

  
  */
}
