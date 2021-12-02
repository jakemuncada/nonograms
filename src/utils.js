import { CELL_WIDTH_MIN, CELL_HEIGHT_MIN } from "./constants";

export const calcCellSize = (rows, boardHeight, cols, boardWidth) => {
    const width = boardWidth / cols;
    const height = boardHeight / rows;
    let cellSize = Math.max(width, height);
    return Math.floor(cellSize);
}

export const calcMinBoardWidth = (cols) => {
    return CELL_WIDTH_MIN * cols;
}

export const calcMinBoardHeight = (rows) => {
    return CELL_HEIGHT_MIN * rows;
}

export const boardClone = (boardData) => {
    if (boardData.length == 0)
        return [];

    let clone = [];
    for (var i = 0; i < boardData.length; i++) {
        clone.push(boardData[i].slice());
    }
    return clone;
}

export const isCellHighlighted = (sRow, sCol, eRow, eCol, row, col) => {
    if (row === sRow && col === sCol) {
        return true;
    }

    const horiDelta = eCol - sCol;
    const vertDelta = eRow - sRow;
    const isVerticalDraw = Math.abs(vertDelta) > Math.abs(horiDelta);

    // Horizontal Draw
    if (row === sRow && isVerticalDraw === false) {
        if (col >= sCol && col <= eCol) {
            return true;
        }
        if (col <= sCol && col >= eCol) {
            return true;
        }
    }

    // Vertical Draw
    if (col === sCol && isVerticalDraw === true) {
        if (row >= sRow && row <= eRow) {
            return true;
        }
        if (row <= sRow && row >= eRow) {
            return true;
        }
    }

    return false;
};