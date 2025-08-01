export function circle(pos, editor, canvas) {
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
