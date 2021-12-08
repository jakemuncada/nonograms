import {
    SET_PUZZLE,
    ADJUST_CELL_SIZE,
} from "../actionTypes";

export const setPuzzle = (puzzleData) => {
    const rows = puzzleData.rows;
    const cols = puzzleData.cols;
    const topClueRows = getTopClueRows(puzzleData.top);
    const topClueData = getTopClueData(puzzleData.top, topClueRows, cols);
    const leftClueCols = getLeftClueCols(puzzleData.left);
    const leftClueData = getLeftClueData(puzzleData.left, rows, leftClueCols);

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

const getTopClueRows = (data) => {
    let maxRows = 0;
    for (let col = 0; col < data.length; col++) {
        maxRows = Math.max(maxRows, data[col].length);
    }
    return maxRows;
}

const getLeftClueCols = (data) => {
    let maxCols = 0;
    for (let row = 0; row < data.length; row++) {
        maxCols = Math.max(maxCols, data[row].length);
    }
    return maxCols;
}

const getTopClueData = (data, rows, cols) => {
    let clueData = [];

    // Fill in the 2D array with null values.
    for (let row = 0; row < rows; row++) {
        let rowArr = []
        for (let col = 0; col < cols; col++) {
            rowArr.push(null);
        }
        clueData.push(rowArr);
    }

    // Then, fill in the actual data into the table.
    for (let col = 0; col < data.length; col++) {
        let row = rows - 1;
        for (let idx = 0; idx < data[col].length; idx++) {
            clueData[row][col] = data[col][idx];
            row -= 1;
        }
    }

    return clueData;
}

const getLeftClueData = (data, rows, cols) => {
    let clueData = [];

    // Fill in the 2D array with null values.
    for (let row = 0; row < rows; row++) {
        let rowArr = []
        for (let col = 0; col < cols; col++) {
            rowArr.push(null);
        }
        clueData.push(rowArr);
    }

    // Then, fill in the actual data into the table.
    for (let row = 0; row < data.length; row++) {
        let col = cols - 1;
        for (let idx = 0; idx < data[row].length; idx++) {
            clueData[row][col] = data[row][idx];
            col -= 1;
        }
    }

    return clueData;
}