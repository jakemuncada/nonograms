import { SYMBOL_ID_FILL } from "../../constants";
import { getCellId } from "../../utils";
import { START_DRAW, END_DRAW, MOVE_DRAW } from "../actionTypes";

const initialState = {
    isDrawing: false,
    drawStartRow: 0,
    drawStartCol: 0,
    drawSymbol: null,
    drawCells: null,
    selectedSymbol: SYMBOL_ID_FILL
};

export default function (state = initialState, action) {
    let cols, row, col, symbolId;

    switch (action.type) {
        case START_DRAW:
            ({ cols, row, col, symbolId } = action.payload);
            return {
                ...state,
                isDrawing: true,
                drawStartRow: row,
                drawStartCol: col,
                drawSymbol: symbolId,
                drawCells: getDrawCells(row, col, row, col, cols)
            };

        case END_DRAW:
            return {
                ...state,
                isDrawing: false,
                drawStartRow: 0,
                drawStartCol: 0,
                drawCells: null
            };

        case MOVE_DRAW:
            ({ cols, row, col } = action.payload);

            return {
                ...state,
                drawCells: getDrawCells(row, col, row, col, cols)
            };

        default:
            return state;
    }
}

const getDrawCells = (sRow, sCol, eRow, eCol, cols) => {
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
