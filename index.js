import { Editor } from "./src/Editor.js";
import {
  circle,
  eraser,
  fill,
  line,
  pen,
  rectangle,
} from "./src/features/index.js";

const tools = [pen, fill, rectangle, eraser, circle, line];

const entryState = {
  color: "black",
  backgroundColor: "white",
  tools: tools,
  currentTool: 0,
  done: [],
};
let editor = new Editor(entryState);
