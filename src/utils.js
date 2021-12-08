export const getCellId = (cols, row, col) => (
    row * cols + col
);

export const getCellRowCol = (cellId, cols) => {
    const row = parseInt(cellId / cols);
    const col = cellId % cols;
    return [row, col];
}

export const arr2dClone = (arr) => {
    if (arr.length === 0)
        return [];

    let clone = [];
    for (var i = 0; i < arr.length; i++) {
        clone.push(arr[i].slice());
    }
    return clone;
}

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