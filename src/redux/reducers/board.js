import { ADJUST_SIZE, ADJUST_POS } from "../actionTypes";
import { CELL_WIDTH_MIN, CELL_HEIGHT_MIN } from "../../constants";

const initialState = {
    rows: 30,
    cols: 30,
    boardPosX: 0,
    boardPosY: 0,
    cellWidth: 20,
    cellHeight: 20,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ADJUST_SIZE:
            const { width, height } = action.payload;
            let newWidth = state.cellWidth + width;
            let newHeight = state.cellHeight + height;
            newWidth = Math.max(newWidth, CELL_WIDTH_MIN);
            newHeight = Math.max(newHeight, CELL_HEIGHT_MIN);
            return {
                ...state,
                cellWidth: newWidth,
                cellHeight: newHeight,
            };
        case ADJUST_POS:
            const { newPosX, newPosY } = action.payload;
            return {
                ...state,
                boardPosX: newPosX,
                boardPosY: newPosY,
            };
        default:
            return state;
    }
}
