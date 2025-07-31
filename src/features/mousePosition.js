import { scale } from "./../index.js";

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
*/
}
