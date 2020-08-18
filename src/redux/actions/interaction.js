const { START_DRAW, END_DRAW, MOVE_DRAW } = require("../actionTypes");

export const startDraw = (row, col) => ({
    type: START_DRAW,
    payload: {
        row: row,
        col: col,
    },
});

export const endDraw = () => ({
    type: END_DRAW,
});

export const moveDraw = (row, col) => ({
    type: MOVE_DRAW,
    payload: {
        row: row,
        col: col,
    },
});
