import { SET_LEFT_CLUES, SET_TOP_CLUES } from "../actionTypes";

export const setTopClues = (rows, cols, data) => ({
    type: SET_TOP_CLUES,
    payload: {
        rows: rows,
        cols: cols,
        data: data,
    },
});

export const setLeftClues = (rows, cols, data) => ({
    type: SET_LEFT_CLUES,
    payload: {
        rows: rows,
        cols: cols,
        data: data,
    },
});
