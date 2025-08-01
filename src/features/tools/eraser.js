export function eraser(pos, editor) {
  function drawPixel({ x, y }) {
    let points = { x, y, color: "white" };
    editor.draw([points]);
  }
  const boundDrawPixel = drawPixel.bind(this);
  boundDrawPixel(pos);
  return boundDrawPixel;
}
