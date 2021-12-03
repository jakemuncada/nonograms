import { CELL_WIDTH_MIN, CELL_HEIGHT_MIN } from "./constants";

export const getCellId = (cols, row, col) => (
    row * cols + col
);

export const getCellRowCol = (cellId, cols) => {
    const row = parseInt(cellId / cols);
    const col = cellId % cols;
    return [row, col];
}

export const calcCellSize = (rows, boardHeight, cols, boardWidth) => {
    const width = boardWidth / cols;
    const height = boardHeight / rows;
    let cellSize = Math.max(width, height);
    return Math.floor(cellSize);
}

export const getCellWidth = (cols, col, cellSize) => {
    if (col === cols - 1) {
        return cellSize + 1;
    }

    if (col % 5 === 0) {
        return cellSize + 1;
    }

    return cellSize;
}

export const getCellHeight = (row, cellSize) => {
    if ((row + 1) % 5 === 0) {
        return cellSize + 1;
    }

    return cellSize;
}

export const calcMinBoardWidth = (cols) => {
    return CELL_WIDTH_MIN * cols;
}

export const calcMinBoardHeight = (rows) => {
    return CELL_HEIGHT_MIN * rows;
}

export const boardClone = (boardData) => {
    if (boardData.length === 0)
        return [];

    let clone = [];
    for (var i = 0; i < boardData.length; i++) {
        clone.push(boardData[i].slice());
    }
    return clone;
}

export const getHighlightedCells = (cols, sRow, sCol, eRow, eCol) => {
    let highlightedCells = new Set();
    highlightedCells.add(getCellId(cols, sRow, sCol));

    if (eRow === sRow && eCol === sCol) {
        return highlightedCells;
    }

    const horiDelta = eCol - sCol;
    const vertDelta = eRow - sRow;
    const isVerticalDraw = Math.abs(vertDelta) > Math.abs(horiDelta);

    // Horizontal Draw
    if (isVerticalDraw === false) {
        let col = Math.min(sCol, eCol);
        let end = Math.max(sCol, eCol);
        while (col <= end) {
            let cellId = getCellId(cols, sRow, col);
            highlightedCells.add(cellId);
            col += 1;
        }
    }
    // Vertical Draw
    else {
        let row = Math.min(sRow, eRow);
        let end = Math.max(sRow, eRow);
        while (row <= end) {
            let cellId = getCellId(cols, row, sCol);
            highlightedCells.add(cellId);
            row += 1;
        }
    }
    
    return highlightedCells;
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