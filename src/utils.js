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