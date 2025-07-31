export class Tools {
  constructor(state) {
    this.element = document.querySelectorAll(".tool");
    this.setActive({ target: { id: 0 } }, state);
    this.element.forEach((el, i) => {
      el.addEventListener("click", (e) => {
        this.setActive(e, state);
      });
    });
  }

  setActive(e, state) {
    this.element.forEach((el) => el.classList.remove("active"));
    this.element[e.target.id].classList.add("active");
    state.currentTool = +e.target.id;
  }
}
