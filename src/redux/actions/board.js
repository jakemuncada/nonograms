import { SET_PUZZLE_DATA, RESET_PUZZLE_DATA, ADJUST_CELL_SIZE } from "../actionTypes";

export const resetPuzzleData = (rows, cols) => ({
    type: RESET_PUZZLE_DATA,
    payload: {
        rows: rows,
        cols: cols
    },
});

export const setPuzzleData = (data) => ({
    type: SET_PUZZLE_DATA,
    payload: {
        data: data
    },
});

export const adjustCellSize = (amount) => ({
    type: ADJUST_CELL_SIZE,
    payload: {
        amount: amount
    },
});