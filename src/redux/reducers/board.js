import { ADJUST_SIZE } from "../actionTypes";

const initialState = {
    rows: 30,
    cols: 30,
    x: 0,
    y: 0,
    cellWidth: 25,
    cellHeight: 25,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ADJUST_SIZE:
            const { width, height } = action.payload;
            const newWidth = state.cellWidth + width;
            const newHeight = state.cellHeight + height;
            return {
                ...state,
                cellWidth: newWidth,
                cellHeight: newHeight,
            };
        default:
            return state;
    }
}
