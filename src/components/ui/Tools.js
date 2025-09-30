export class Tools {
  constructor(state) {
    this.element = Array.from(document.querySelectorAll(".tool"));

    this.currentTool = this.element[state.currentTool];
    this.currentTool.classList.add("active");

    this.element.forEach((tool) => {
      tool.addEventListener("click", () => this.setActive(tool, state));
    });
  }

  setActive(tool, state) {
    this.currentTool?.classList.remove("active");
    this.currentTool = tool;
    tool.classList.add("active");
    state.tools = state.this.element.indexOf(tool);
    // console.log(this.element.indexOf(tool));
  }
}
