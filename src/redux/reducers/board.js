import { boardClone, getCellRowCol, getDrawCells } from "../../utils";

import {
    CELL_SIZE_MIN,
    SYMBOL_ID_EMPTY,
    SYMBOL_ID_FILL
} from "../../constants";

import {
    SET_PUZZLE_DATA,
    RESET_PUZZLE_DATA,
    ADJUST_CELL_SIZE,
    SET_CROSSHAIR,
    START_DRAW,
    END_DRAW,
    MOVE_DRAW
} from "../actionTypes";

const initialState = {
    rows: 30,
    cols: 30,
    cellSize: 20,
    data: [],
    crosshairRow: null,
    crosshairCol: null,
    isDrawing: false,
    drawStartRow: 0,
    drawStartCol: 0,
    drawSymbol: null,
    drawCells: null,
    selectedSymbol: SYMBOL_ID_FILL
};

export default function (state = initialState, action) {
    let rows, cols, row, col, symbolId;

    switch (action.type) {
        case ADJUST_CELL_SIZE:
            let newCellSize = state.cellSize + action.payload.amount;
            newCellSize = Math.max(newCellSize, CELL_SIZE_MIN);
            return {
                ...state,
                cellSize: newCellSize
            }

        case RESET_PUZZLE_DATA:
            ({ rows, cols } = action.payload);
            let newData = [];
            for (let row = 0; row < rows; row++) {
                newData.push([]);
                for (let col = 0; col < cols; col++) {
                    let value = SYMBOL_ID_EMPTY;
                    newData[row].push(value);
                }
            }

            return {
                ...state,
                rows: rows,
                cols: cols,
                data: newData
            }

        case SET_PUZZLE_DATA:
            return {
                ...state,
                data: boardClone(action.payload.data)
            }

        case SET_CROSSHAIR:
            ({ row, col } = action.payload);
            return {
                ...state,
                crosshairRow: row,
                crosshairCol: col
            }

        case START_DRAW:
            ({ row, col, symbolId } = action.payload);
            return {
                ...state,
                isDrawing: true,
                drawStartRow: row,
                drawStartCol: col,
                drawSymbol: symbolId,
                drawCells: getDrawCells(row, col, row, col, state.cols)
            };

        case END_DRAW:
            const newBoard = boardClone(state.data);
            
            if (state.isDrawing) {
                const drawSymbol = state.drawSymbol;
                state.drawCells.forEach(cellId => {
                    [row, col] = getCellRowCol(cellId, state.cols);
                    newBoard[row][col] = drawSymbol;
                });
            }

            return {
                ...state,
                isDrawing: false,
                drawStartRow: 0,
                drawStartCol: 0,
                drawCells: null,
                data: newBoard
            };

        case MOVE_DRAW:
            ({ row, col } = action.payload);
            return {
                ...state,
                drawCells: getDrawCells(state.drawStartRow, state.drawStartCol, row, col, state.cols)
            };

        default:
            return state;
    }
}