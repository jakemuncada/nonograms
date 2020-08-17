import { combineReducers } from "redux";
import board from "./board";
import interaction from "./interaction";

export default combineReducers({ board, interaction });
