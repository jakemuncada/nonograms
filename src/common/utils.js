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