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

export const boardClone = (boardData) => {
    if (boardData.length === 0)
        return [];

    let clone = [];
    for (var i = 0; i < boardData.length; i++) {
        clone.push(boardData[i].slice());
    }
    return clone;
}

export const getDrawCells = (sRow, sCol, eRow, eCol, cols) => {
    let drawCells = new Set();
    drawCells.add(getCellId(cols, sRow, sCol));

    if (eRow === sRow && eCol === sCol) {
        return drawCells;
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
            drawCells.add(cellId);
            col += 1;
        }
    }
    // Vertical Draw
    else {
        let row = Math.min(sRow, eRow);
        let end = Math.max(sRow, eRow);
        while (row <= end) {
            let cellId = getCellId(cols, row, sCol);
            drawCells.add(cellId);
            row += 1;
        }
    }
    
    return drawCells;
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