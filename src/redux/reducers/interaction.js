import { START_DRAG, END_DRAG, MOVE_DRAG } from "../actionTypes";

const initialState = {
    isDragging: false,
    dragStartRow: 0,
    dragStartCol: 0,
    dragEndRow: 0,
    dragEndCol: 0,
};

export default function (state = initialState, action) {
    let row, col;

    switch (action.type) {
        case START_DRAG:
            ({ row, col } = action.payload);
            return {
                ...state,
                isDragging: true,
                dragStartRow: row,
                dragStartCol: col,
                dragEndRow: row,
                dragEndCol: col,
            };
        case END_DRAG:
            return {
                ...state,
                isDragging: false,
                dragStartRow: 0,
                dragStartCol: 0,
                dragEndRow: 0,
                dragEndCol: 0,
            };
        case MOVE_DRAG:
            ({ row, col } = action.payload);
            return {
                ...state,
                dragEndRow: row,
                dragEndCol: col,
            };
        default:
            return state;
    }
}
