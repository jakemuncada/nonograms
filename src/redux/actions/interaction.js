const { START_DRAW, END_DRAW, MOVE_DRAW } = require("../actionTypes");

export const startDraw = (cols, row, col, symbolId) => ({
    type: START_DRAW,
    payload: {
        cols: cols,
        row: row,
        col: col,
        symbolId: symbolId
    },
});

export const endDraw = () => ({
    type: END_DRAW,
});

export const moveDraw = (cols, row, col) => ({
    type: MOVE_DRAW,
    payload: {
        cols: cols,
        row: row,
        col: col,
    },
});
