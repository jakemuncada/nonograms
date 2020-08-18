import { START_DRAW, END_DRAW, MOVE_DRAW } from "../actionTypes";

const initialState = {
    isDrawing: false,
    drawStartRow: 0,
    drawStartCol: 0,
    drawEndRow: 0,
    drawEndCol: 0,
};

export default function (state = initialState, action) {
    let row, col;

    switch (action.type) {
        case START_DRAW:
            ({ row, col } = action.payload);
            return {
                ...state,
                isDrawing: true,
                drawStartRow: row,
                drawStartCol: col,
                drawEndRow: row,
                drawEndCol: col,
            };
        case END_DRAW:
            return {
                ...state,
                isDrawing: false,
                drawStartRow: 0,
                drawStartCol: 0,
                drawEndRow: 0,
                drawEndCol: 0,
            };
        case MOVE_DRAW:
            ({ row, col } = action.payload);
            return {
                ...state,
                drawEndRow: row,
                drawEndCol: col,
            };
        default:
            return state;
    }
}