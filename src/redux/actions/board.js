import {
    SET_PUZZLE_DATA,
    RESET_PUZZLE_DATA,
    ADJUST_CELL_SIZE,
    SET_CROSSHAIR,
    START_DRAW,
    END_DRAW,
    MOVE_DRAW
} from "../actionTypes";

export const resetPuzzleData = (rows, cols) => ({
    type: RESET_PUZZLE_DATA,
    payload: {
        rows: rows,
        cols: cols
    }
});

export const setPuzzleData = (data) => ({
    type: SET_PUZZLE_DATA,
    payload: {
        data: data
    }
});

export const adjustCellSize = (amount) => ({
    type: ADJUST_CELL_SIZE,
    payload: {
        amount: amount
    }
});

export const setCrosshair = (row, col) => ({
    type: SET_CROSSHAIR,
    payload: {
        row: row,
        col: col
    }
});

export const startDraw = (row, col, symbolId) => ({
    type: START_DRAW,
    payload: {
        row: row,
        col: col,
        symbolId: symbolId
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