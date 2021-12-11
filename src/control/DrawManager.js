import {
    CLASSNAME_CELL_CONTENT,
    CLASSNAME_CELL_DRAWING,
    DRAWING_DIR_HORIZONTAL,
    DRAWING_DIR_POINT,
    DRAWING_DIR_VERTICAL,
    SYMBOL_ID_EMPTY,
    SYMBOL_ID_FILL,
    SYMBOL_ID_X
} from "../constants";
import DrawCountManager from "./DrawCountManager";

const SYMBOL_CLASSNAMES = {
    [SYMBOL_ID_EMPTY]: null,
    [SYMBOL_ID_FILL]: "cell-fill",
    [SYMBOL_ID_X]: "cell-x"
};

export default class DrawManager {

    puzzle = null;

    countMgr = null;

    cellElemsDict = {};

    isDrawing = false;

    drawingDir = null;

    drawSymbol = SYMBOL_ID_FILL;

    drawCells = new Set();

    sRow = null;

    sCol = null;

    eRow = null;

    eCol = null;

    constructor(puzzle) {
        this.puzzle = puzzle;
        this.countMgr = new DrawCountManager(puzzle);
    }

    initialize() {
        this.countMgr.initialize();

        this.cellElemsDict = {};
        for (let rowIdx = 0; rowIdx < this.puzzle.rows; rowIdx++) {
            for (let colIdx = 0; colIdx < this.puzzle.rows; colIdx++) {
                const cellId = this.puzzle.getCellId(rowIdx, colIdx);
                this.cellElemsDict[cellId] = document.getElementById(`cell-${cellId}`);
            }
        }
    }

    getCellElement(row, col) {
        const cellId = this.puzzle.getCellId(row, col);
        return this.cellElemsDict[cellId];
    }

    start(sRow, sCol, drawSymbol) {
        this.sRow = sRow;
        this.sCol = sCol;
        this.eRow = sRow;
        this.eCol = sCol;
        this.isDrawing = true;
        this.drawingDir = DRAWING_DIR_POINT;

        this.countMgr.hide();

        this.drawCells.clear();
        const newDrawCells = new Set();
        newDrawCells.add(this.puzzle.getCellId(sRow, sCol))

        const cellSymbol = this.puzzle.board[sRow][sCol];

        if (drawSymbol === SYMBOL_ID_EMPTY) {
            this.drawSymbol = SYMBOL_ID_EMPTY;
        }
        else if (drawSymbol === cellSymbol) {
            this.drawSymbol = SYMBOL_ID_EMPTY;
        }
        else {
            this.drawSymbol = drawSymbol;
        }

        this.renderCells(newDrawCells);
    }

    move(currRow, currCol) {
        const [newDrawCells, newEndRow, newEndCol, dir] = this.getDrawnCells(currRow, currCol);
        this.eRow = newEndRow;
        this.eCol = newEndCol;
        this.drawingDir = dir;

        if (newDrawCells.size > 1) {
            const sCell = this.getCellElement(this.sRow, this.sCol);
            const eCell = this.getCellElement(newEndRow, newEndCol);
            this.countMgr.update(this.sRow, this.sCol,
                newEndRow, newEndCol, this.puzzle.board, this.drawSymbol, sCell, eCell);
        }

        this.renderCells(newDrawCells);
    }

    end() {
        this.isDrawing = false;
        // Finalize the drawn cells by reflecting the changes onto the actual board.
        this.drawCells.forEach(cellId => {
            const [row, col] = this.puzzle.getCellRowCol(cellId);
            this.puzzle.board[row][col] = this.drawSymbol;
        });

        this.countMgr.hide();
        this.renderCells();
    }

    cancel() {
        this.isDrawing = false;
        this.countMgr.hide();
        this.renderCells();
    }

    renderCells(newDrawCells = null) {
        this.drawCells.forEach(cellId => {
            const [row, col] = this.puzzle.getCellRowCol(cellId);
            const cellSymbol = this.puzzle.board[row][col];
            this.renderCell(cellId, cellSymbol, false);
        });

        let symbolId;
        this.drawCells.clear();
        if (newDrawCells !== null) {
            newDrawCells.forEach(cellId => {
                if (this.drawSymbol === SYMBOL_ID_EMPTY) {
                    const [row, col] = this.puzzle.getCellRowCol(cellId);
                    symbolId = this.puzzle.board[row][col];
                } else {
                    symbolId = this.drawSymbol;
                }
                this.renderCell(cellId, symbolId, true);
            });
        }
    }

    renderCell(cellId, symbolId, isDrawing) {
        const elem = this.cellElemsDict[cellId];
        if (elem !== undefined && elem !== null) {
            elem.className = CLASSNAME_CELL_CONTENT;

            if (isDrawing) {
                elem.classList.add(CLASSNAME_CELL_DRAWING);
                this.drawCells.add(cellId);
            } else {
                elem.classList.remove(CLASSNAME_CELL_DRAWING);
            }

            const symbolClassName = SYMBOL_CLASSNAMES[symbolId];
            if (symbolClassName !== null) {
                elem.classList.add(symbolClassName);
            }
        }
    }

    getDrawnCells(currRow, currCol) {
        const sRow = this.sRow;
        const sCol = this.sCol;

        let drawCells = new Set();
        drawCells.add(this.puzzle.getCellId(sRow, sCol));

        if (currRow === sRow && currCol === sCol) {
            return [drawCells, sRow, sCol, DRAWING_DIR_POINT];
        }

        const horiDelta = currCol - sCol;
        const vertDelta = currRow - sRow;
        const isVerticalDraw = Math.abs(vertDelta) > Math.abs(horiDelta);

        let dir;
        let newDrawEndRow = sRow;
        let newDrawEndCol = sCol;

        // Horizontal Draw
        if (isVerticalDraw === false) {
            dir = DRAWING_DIR_HORIZONTAL;
            let col = Math.min(sCol, currCol);
            let end = Math.max(sCol, currCol);
            newDrawEndCol = currCol;
            while (col <= end) {
                let cellId = this.puzzle.getCellId(sRow, col);
                drawCells.add(cellId);
                col += 1;
            }

        }
        // Vertical Draw
        else {
            dir = DRAWING_DIR_VERTICAL;
            let row = Math.min(sRow, currRow);
            let end = Math.max(sRow, currRow);
            newDrawEndRow = currRow;
            while (row <= end) {
                let cellId = this.puzzle.getCellId(row, sCol);
                drawCells.add(cellId);
                row += 1;
            }
        }

        return [drawCells, newDrawEndRow, newDrawEndCol, dir];
    }
}