import { combineReducers } from "redux";
import board from "./board";
import clues from "./clues";
import interaction from "./interaction";

export default combineReducers({ board, clues, interaction });
