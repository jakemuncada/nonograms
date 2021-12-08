import {
    CELL_SIZE_MIN,
} from "../../constants";
import nonogram from "../../control/nonogram";

import {
    ADJUST_CELL_SIZE,
    SET_PUZZLE,
} from "../actionTypes";

const initialState = {
    rows: 0,
    cols: 0,
    cellSize: 20,
    topClueRows: 0,
    topClueData: [],
    leftClueCols: 0,
    leftClueData: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_PUZZLE:
            const {
                rows, cols,
                topClueRows, leftClueCols,
                topClueData, leftClueData
            } = action.payload;

            nonogram.setSize(rows, cols);
            nonogram.setClues(topClueRows, topClueData, leftClueCols, leftClueData);

            return {
                ...state,
                rows: rows,
                cols: cols,
                topClueRows: topClueRows,
                leftClueCols: leftClueCols,
                topClueData: topClueData,
                leftClueData: leftClueData
            }

        case ADJUST_CELL_SIZE:
            let newCellSize = state.cellSize + action.payload.amount;
            newCellSize = Math.max(newCellSize, CELL_SIZE_MIN);
            return {
                ...state,
                cellSize: newCellSize
            }

        default:
            return state;
    }
}

