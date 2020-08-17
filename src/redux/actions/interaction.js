const { START_DRAG, END_DRAG, MOVE_DRAG } = require("../actionTypes");

export const startDrag = (row, col) => ({
    type: START_DRAG,
    payload: {
        row: row,
        col: col,
    },
});

export const endDrag = () => ({
    type: END_DRAG,
});

export const moveDrag = (row, col) => ({
    type: MOVE_DRAG,
    payload: {
        row: row,
        col: col,
    },
});
