const around = [
  { dx: -1, dy: 0 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: -1 },
  { dx: 0, dy: 1 },
];

export function fill(pos, editor, canvas) {
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
