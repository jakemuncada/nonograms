import { SelectionDirEnum } from "./enums";

/**
 * Returns the ID of the cell.
 * @param {number} cols The number of columns of the board.
 * @param {number} row The row index of the cell.
 * @param {number} col The column index of the cell.
 * @returns {number} The cell id.
 */
export const getCellId = (cols, row, col) => (
    row * cols + col
);

/**
 * Returns the row and column index of the cell.
 * @param {number} cellId The cell id.
 * @param {number} cols The number of columns of the board.
 * @returns {number[]} The row and column index of the cell.
 */
export const getCellRowCol = (cellId, cols) => {
    const row = parseInt(cellId / cols);
    const col = cellId % cols;
    return [row, col];
}

/**
 * Clones and returns a given 2D array.
 * @param {any[][]} arr The 2D array to be cloned.
 * @returns {any[][]} A clone of the given 2D array.
 */
export const arr2dClone = (arr) => {
    if (arr.length === 0)
        return [];

    let clone = [];
    for (var i = 0; i < arr.length; i++) {
        clone.push(arr[i].slice());
    }
    return clone;
}

/**
 * Returns the font size of the clues.
 * @param {number} cellSize The size of the cell in pixels.
 * @returns {number} The font size of the clues.
 */
export const getClueFontSize = (cellSize) => {
    let fontSize;
    if (cellSize > 28) {
        fontSize = 13;
    }
    else if (cellSize > 24) {
        fontSize = 12;
    }
    else if (cellSize > 22) {
        fontSize = 11;
    }
    else if (cellSize > 20) {
        fontSize = 10;
    }
    else {
        fontSize = 9;
    }
    return fontSize;
}

/**
 * When the user selects/highlights a line of cells,
 * calculate and return an array containing the selection information:
 * 
 * - The set containing the IDs of the selected cells.
 * - The row index of the cell where the selection ends.
 * - The column index of the cell where the selection ends.
 * - The selection direction.
 * 
 * @param {number} sRow The row index of the cell where the selection started.
 * @param {number} sCol The column index of the cell where the selection started.
 * @param {number} currRow The row index of the cell where the cursor is currently on.
 * @param {number} currCol The column index of the cell where the cursor is currently on.
 * @param {number} cols The number of columns of the puzzle.
 * @returns {Array} The array of items as described above.
 */
export const getSelectionInfo = (sRow, sCol, currRow, currCol, cols) => {

    let drawCells = new Set();
    drawCells.add(getCellId(cols, sRow, sCol));

    // If the cursor is on the starting cell.
    if (currRow === sRow && currCol === sCol) {
        return [drawCells, sRow, sCol, SelectionDirEnum.POINT];
    }

    const horiDelta = currCol - sCol;
    const vertDelta = currRow - sRow;
    const isVerticalDraw = Math.abs(vertDelta) > Math.abs(horiDelta);

    let dir;
    let newDrawEndRow = sRow;
    let newDrawEndCol = sCol;

    // Horizontal Draw
    if (isVerticalDraw === false) {
        dir = SelectionDirEnum.HORIZONTAL;
        let col = Math.min(sCol, currCol);
        let end = Math.max(sCol, currCol);
        newDrawEndCol = currCol;
        while (col <= end) {
            let cellId = getCellId(cols, sRow, col);
            drawCells.add(cellId);
            col += 1;
        }

    }
    // Vertical Draw
    else {
        dir = SelectionDirEnum.VERTICAL;
        let row = Math.min(sRow, currRow);
        let end = Math.max(sRow, currRow);
        newDrawEndRow = currRow;
        while (row <= end) {
            let cellId = getCellId(cols, row, sCol);
            drawCells.add(cellId);
            row += 1;
        }
    }

    return [drawCells, newDrawEndRow, newDrawEndCol, dir];
}