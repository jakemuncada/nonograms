import { combineReducers } from "redux";
import board from "./board";
import interaction from "./interaction";

document.addEventListener('contextmenu', event => event.preventDefault());

export default combineReducers({ board, interaction });
