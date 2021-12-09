import {
    SET_PUZZLE,
    ADJUST_CELL_SIZE,
} from "../actionTypes";

export const setPuzzle = (rows, cols, topClueRows, topClueData, leftClueCols, leftClueData) => {
    return {
        type: SET_PUZZLE,
        payload: {
            rows: rows,
            cols: cols,
            topClueRows: topClueRows,
            topClueData: topClueData,
            leftClueCols: leftClueCols,
            leftClueData: leftClueData
        }
    };
}

export const adjustCellSize = (amount) => ({
    type: ADJUST_CELL_SIZE,
    payload: {
        amount: amount
    }
});
