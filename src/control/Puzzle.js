import { getCellId, getCellRowCol } from "../common/utils";
import {
    ClueStatusEnum,
    ClueTypeEnum,
    DrawingSymbolEnum
} from "../common/enums";


/** Class containing the puzzle information. */
class Puzzle {
    /**
     * The number of rows of the board.
     * @type {number}
     */
    rows = 0;

    /**
     * The number of columns of the board.
     * @type {number}
     */
    cols = 0;

    /**
     * The 2-dimensional array containing each cell's information.
     * @type {number[][]}
     */
    board = null;

    /**
     * The number of rows of the top panel clues.
     * @type {number}
     */
    topClueRows = null;

    /**
     * The number of columns of the top panel clues.
     * @type {number}
     */
    topClueCols = null;

    /**
     * The processed data of the top panel clues.
     * @type {number[][]}
     */
    topClueData = null;

    /**
     * The status of each clue in the top panel.
     * @type {ClueStatusEnum[][]}
     */
    topClueState = null;

    /**
     * The number of rows of the left panel clues.
     * @type {number}
     */
    leftClueRows = null;

    /**
     * The number of columns of the left panel clues.
     * @type {number}
     */
    leftClueCols = null;

    /**
     * The processed data of the left panel clues.
     * @type {number[][]}
     */
    leftClueData = null;

    /**
     * The status of each clue int the left panel.
     * @type {ClueStatusEnum[][]}
     */
    leftClueState = null;

    /**
     * Constructor for a Puzzle.
     * 
     * @param {object} puzzleData The unprocessed puzzle data.
     * @param {number} puzzleData.rows The number of rows of the board.
     * @param {number } puzzleData.cols The number of columns of the board.
     * @param {number[][]} puzzleData.topClues The data of the top clues.
     * @param {number[][]} puzzleData.leftClues The data of the left clues.
     */
    constructor(puzzleData) {
        if (puzzleData) {
            this.initialize(puzzleData);
        }
    }

    /**
     * Initialize the puzzle.
     * 
     * @param {object} puzzleData The unprocessed puzzle data.
     * @param {number} puzzleData.rows The number of rows of the board.
     * @param {number } puzzleData.cols The number of columns of the board.
     * @param {number[][]} puzzleData.topClues The data of the top clues.
     * @param {number[][]} puzzleData.leftClues The data of the left clues.
     */
    initialize(puzzleData) {
        this.rows = puzzleData.rows;
        this.cols = puzzleData.cols;

        if (this.rows === 0 || this.cols === 0) {
            throw new RangeError(`Invalid puzzle row and column: ${this.rows}, ${this.cols}`);
        }

        this.topClueCols = this.cols;
        this.topClueRows = getTopClueRows(puzzleData.top);
        this.topClueData = getTopClueData(puzzleData.top, this.topClueRows, this.cols);
        this.topClueState = getClueState(this.topClueData);

        this.leftClueRows = this.rows;
        this.leftClueCols = getLeftClueCols(puzzleData.left);
        this.leftClueData = getLeftClueData(puzzleData.left, this.rows, this.leftClueCols);
        this.leftClueState = getClueState(this.leftClueData);

        this.board = new Array(this.rows);
        for (let rowIdx = 0; rowIdx < this.rows; rowIdx++) {
            this.board[rowIdx] = new Array(this.cols);
            for (let colIdx = 0; colIdx < this.cols; colIdx++) {
                this.board[rowIdx][colIdx] = DrawingSymbolEnum.EMPTY;
            }
        }
    }

    /**
     * Returns the cell id.
     * 
     * @param {number} row The row index of the cell.
     * @param {number} col The column index of the cell.
     * @returns {number} The cell id.
     */
    getCellId(row, col) {
        return getCellId(this.cols, row, col);
    }

    /**
     * Returns the row and column indices of the given cell id.
     * @param {number} cellId The cell id.
     * @returns {number[]} The row and column indices of the given cell id.
     */
    getCellRowCol(cellId) {
        return getCellRowCol(cellId, this.cols);
    }

    /**
     * Get the clue information based on the clue type.
     * 
     * - rows: The number of rows of the clue panel.
     * - cols: The number of columns of the clue panel.
     * - data: The clue data.
     * - state: The clue state.
     * 
     * @param {ClueTypeEnum} clueType The clue type.
     * @throws An error if something went wrong.
     * @returns {{rows: number, cols: number, data: number[][], state: ClueStatusEnum[][]}}
     */
    getClueInfo(clueType) {
        switch (clueType) {
            case ClueTypeEnum.TOP:
                if (!this.topClueData) {
                    throw new ReferenceError("Top clue data does not exist.")
                }

                if (!this.topClueState) {
                    throw new ReferenceError("Top clue state does not exist.")
                }

                return {
                    rows: this.topClueRows,
                    cols: this.topClueCols,
                    data: this.topClueData,
                    state: this.topClueState,
                };

            case ClueTypeEnum.LEFT:
                if (!this.leftClueData) {
                    throw new ReferenceError("Left clue data does not exist.")
                }

                if (!this.leftClueState) {
                    throw new ReferenceError("Left clue state does not exist.")
                }

                return {
                    rows: this.leftClueRows,
                    cols: this.leftClueCols,
                    data: this.leftClueData,
                    state: this.leftClueState,
                };

            default:
                throw new Error("Clue type is invalid:", clueType);
        }
    }
}

/**
 * Gets the number of rows of the top panel clues.
 * 
 * @param {number[][]} data The data of the clues at the top panel.
 * @returns {number} The number of rows of the top panel clues.
 */
const getTopClueRows = (data) => {
    let maxRows = 0;
    for (let col = 0; col < data.length; col++) {
        maxRows = Math.max(maxRows, data[col].length);
    }
    return maxRows;
}

/**
 * Gets the number of columns of the left panel clues.
 * 
 * @param {number[][]} data The data of the clues at the left panel.
 * @returns {number} The number of columns of the left panel clues.
 */
const getLeftClueCols = (data) => {
    let maxCols = 0;
    for (let row = 0; row < data.length; row++) {
        maxCols = Math.max(maxCols, data[row].length);
    }
    return maxCols;
}

/**
 * Processes the top clue data and returns it in as a 2-dimensional array.
 * 
 * @param {number[][]} data The data of the clues at the top panel.
 * @param {number} rows The number of rows of the top panel.
 * @param {number} cols The number of columns of the top panel.
 * @returns {number[][]} The top clue data as a 2-dimensional array.
 */
const getTopClueData = (data, rows, cols) => {
    let clueData = [];

    // Fill in the 2D array with null values.
    for (let row = 0; row < rows; row++) {
        let rowArr = [];
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

/**
 * Processes the left clue data and returns it in as a 2-dimensional array.
 * 
 * @param {number[][]} data The data of the clues at the left panel.
 * @param {number} rows The number of rows of the left panel.
 * @param {number} cols The number of columns of the left panel.
 * @returns {number[][]} The left clue data as a 2-dimensional array.
 */
const getLeftClueData = (data, rows, cols) => {
    let clueData = [];

    // Fill in the 2D array with null values.
    for (let row = 0; row < rows; row++) {
        let rowArr = [];
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

const getClueState = (data) => {
    if (data === null) {
        return null;
    }

    const state = new Array(data.length);
    for (let rowIdx = 0; rowIdx < data.length; rowIdx++) {
        state[rowIdx] = new Array(data[rowIdx].length);
        for (let colIdx = 0; colIdx < data[rowIdx].length; colIdx++) {
            const status = (data[rowIdx][colIdx] !== null) ?
                ClueStatusEnum.UNFINISHED : ClueStatusEnum.BLANK;
            state[rowIdx][colIdx] = status;
        }
    }

    return state;
}

export default new Puzzle();