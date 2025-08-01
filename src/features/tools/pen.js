export function pen(pos, editor) {
  function drawPixel({ x, y }) {
    let points = { x, y, color: editor.state.color };
    editor.draw([points]);
  }
  const boundDrawPixel = drawPixel.bind(this);
  boundDrawPixel(pos);
  return boundDrawPixel;
}
