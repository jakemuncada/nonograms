import { ADJUST_SIZE } from "../actionTypes";
import { CELL_WIDTH_MIN, CELL_HEIGHT_MIN } from "../../constants";

const initialState = {
    rows: 30,
    cols: 30,
    cellWidth: 22,
    cellHeight: 22,
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
        default:
            return state;
    }
}
