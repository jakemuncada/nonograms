import { SET_LEFT_CLUES, SET_TOP_CLUES } from "../actionTypes";

const initialState = {
    topClueRows: 0,
    topClueCols: 0,
    topClueData: [],
    leftClueRows: 0,
    leftClueCols: 0,
    leftClueData: []
}

export default function (state = initialState, action) {
    let rows, cols, data, clueRows, clueCols, clueData;

    switch (action.type) {
        case SET_TOP_CLUES:
            ({ cols, data } = action.payload);
            clueCols = cols;
            clueRows = getTopClueRows(data);
            clueData = getTopClueData(data, clueRows, clueCols);
            return {
                ...state,
                topClueRows: clueRows,
                topClueCols: clueCols,
                topClueData: clueData
            }

        case SET_LEFT_CLUES:
            ({ rows, data } = action.payload);
            clueRows = rows;
            clueCols = getLeftClueCols(data);
            clueData = getLeftClueData(data, clueRows, clueCols);
            return {
                ...state,
                leftClueRows: clueRows,
                leftClueCols: clueCols,
                leftClueData: clueData
            }

        default:
            return state;
    }
}

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