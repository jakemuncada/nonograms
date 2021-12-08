import { arr2dClone, getCellId, getCellRowCol } from "../utils";
import {
    CLASSNAME_CELL_CONTENT,
    CLASSNAME_CELL_DRAWING,
    CLASSNAME_CROSSHAIR_ACTIVE,
    SYMBOL_ID_EMPTY,
    SYMBOL_ID_FILL,
    SYMBOL_ID_X
} from "../constants";

class Nonogram {

    rows = 0;
    cols = 0;
    board = null;
    cellElems = {};
    crosshairElems = {};
    selectedSymbol = SYMBOL_ID_FILL;
    isDrawing = false;
    drawCells = new Set();
    drawSymbol = null;
    drawStartRow = null;
    drawStartCol = null;
    currCrosshairElems = new Set();

    symbolClassNames = {
        [SYMBOL_ID_EMPTY]: null,
        [SYMBOL_ID_FILL]: "cell-fill",
        [SYMBOL_ID_X]: "cell-x"
    };

    constructor(rows = 0, cols = 0) {
        this.setSize(rows, cols);
    }

    setSize(rows, cols) {
        this.rows = rows;
        this.cols = cols;

        if (rows === 0 || cols === 0) {
            this.board = null;
            return;
        }

        this.board = new Array(rows);
        for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
            this.board[rowIdx] = new Array(cols);
        }
    }

    setBoard(board) {
        if (board === null) {
            this.board = null;
        }
        else {
            this.board = arr2dClone(board);
        }
    }

    initialize() {
        this.cellElems = {};
        for (let rowIdx = 0; rowIdx < this.rows; rowIdx++) {
            for (let colIdx = 0; colIdx < this.rows; colIdx++) {
                const cellId = getCellId(this.cols, rowIdx, colIdx);
                this.cellElems[cellId] = document.getElementById(`cell_${cellId}`);
            }
        }

        this.crosshairElems = {};
        for (let rowIdx = 0; rowIdx < this.rows; rowIdx++) {
            const key = `row-${rowIdx}`;
            const query = `.cell-overlay.${key}`;
            const elems = document.querySelectorAll(query);
            this.crosshairElems[key] = elems;
        }
        for (let colIdx = 0; colIdx < this.cols; colIdx++) {
            const key = `col-${colIdx}`;
            const query = `.cell-overlay.${key}`;
            const elems = document.querySelectorAll(query);
            this.crosshairElems[key] = elems;
        }
    }

    startDrawing(sRow, sCol, drawSymbol) {
        this.drawStartRow = sRow;
        this.drawStartCol = sCol;
        this.isDrawing = true;

        this.drawCells.clear();
        const newDrawCells = new Set();
        newDrawCells.add(getCellId(this.cols, sRow, sCol))

        const cellSymbol = this.board[sRow][sCol];

        if (drawSymbol === SYMBOL_ID_EMPTY) {
            this.drawSymbol = SYMBOL_ID_EMPTY;
        }
        else if (drawSymbol === cellSymbol) {
            this.drawSymbol = SYMBOL_ID_EMPTY;
        }
        else {
            this.drawSymbol = drawSymbol;
        }

        this.renderDrawing(newDrawCells);
    }

    moveDrawing(eRow, eCol) {
        const newDrawCells = this.getDrawCells(eRow, eCol);
        this.renderDrawing(newDrawCells);
    }

    endDrawing() {
        this.isDrawing = false;
        this.drawCells.forEach(cellId => {
            const [row, col] = getCellRowCol(cellId, this.cols);
            this.board[row][col] = this.drawSymbol;
        });
        this.renderDrawing();
    }

    renderDrawing(newDrawCells = null) {
        this.drawCells.forEach(cellId => {
            const [row, col] = getCellRowCol(cellId, this.cols);
            const cellSymbol = this.board[row][col];
            this.renderCell(cellId, cellSymbol, false);
        });

        this.drawCells.clear();
        if (newDrawCells !== null) {
            newDrawCells.forEach(cellId => {
                this.renderCell(cellId, this.drawSymbol, true);
            });
        }
    }

    renderCell(cellId, symbolId, isDrawing) {
        const elem = this.cellElems[cellId];
        if (elem !== undefined && elem !== null) {
            elem.className = CLASSNAME_CELL_CONTENT;

            if (isDrawing) {
                elem.classList.add(CLASSNAME_CELL_DRAWING);
                this.drawCells.add(cellId);
            } else {
                elem.classList.remove(CLASSNAME_CELL_DRAWING);
            }

            const symbolClassName = this.symbolClassNames[symbolId];
            if (symbolClassName !== null) {
                elem.classList.add(symbolClassName);
            }
        }
    }

    getDrawCells(eRow, eCol) {
        const sRow = this.drawStartRow;
        const sCol = this.drawStartCol;

        let drawCells = new Set();
        drawCells.add(getCellId(this.cols, sRow, sCol));
    
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
                let cellId = getCellId(this.cols, sRow, col);
                drawCells.add(cellId);
                col += 1;
            }
        }
        // Vertical Draw
        else {
            let row = Math.min(sRow, eRow);
            let end = Math.max(sRow, eRow);
            while (row <= end) {
                let cellId = getCellId(this.cols, row, sCol);
                drawCells.add(cellId);
                row += 1;
            }
        }
        
        return drawCells;
    }

    setCrosshair(rowIdx, colIdx) {
        this.currCrosshairElems.forEach(elem => {
            elem.classList.remove(CLASSNAME_CROSSHAIR_ACTIVE);
        });
        this.currCrosshairElems.clear();

        if (rowIdx === null || colIdx === null) {
            return;
        }

        const key1 = `row-${rowIdx}`;
        const key2 = `col-${colIdx}`;
        this.crosshairElems[key1].forEach(elem => {
            elem.classList.add(CLASSNAME_CROSSHAIR_ACTIVE);
            this.currCrosshairElems.add(elem);
        });
        this.crosshairElems[key2].forEach(elem => {
            elem.classList.add(CLASSNAME_CROSSHAIR_ACTIVE);
            this.currCrosshairElems.add(elem);
        });
    }
}

const nonogram = new Nonogram();
export default nonogram;