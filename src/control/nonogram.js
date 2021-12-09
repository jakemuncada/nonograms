import DrawCounter from "./draw-counter";
import { arr2dClone, getCellId, getCellRowCol } from "../utils";
import {
    CLASSNAME_CELL_CONTENT,
    CLASSNAME_CELL_DRAWING,
    CLASSNAME_CLUE_SLASH,
    CLASSNAME_CROSSHAIR_ACTIVE,
    DRAWING_DIR_HORIZONTAL,
    DRAWING_DIR_POINT,
    DRAWING_DIR_VERTICAL,
    SVG_URL_CLUE_SLASH,
    SVG_URL_FILL,
    SVG_URL_X,
    SYMBOL_ID_EMPTY,
    SYMBOL_ID_FILL,
    SYMBOL_ID_X
} from "../constants";

class Nonogram {

    rows = 0;
    cols = 0;
    board = null;
    topClueRows = 0;
    topClueData = null;
    leftClueCols = 0;
    leftClueData = null;
    cellElemsDict = {};
    crosshairElemsDict = {};
    clueOverlayElemsDict = {};
    selectedSymbol = SYMBOL_ID_FILL;
    isDrawing = false;
    drawingDir = null;
    drawCells = new Set();
    drawSymbol = null;
    drawStartRow = null;
    drawStartCol = null;
    drawEndRow = null;
    drawEndCol = null;
    crosshairRow = null;
    crosshairCol = null;
    currCrosshairElems = new Set();
    imageCache = {}

    symbolClassNames = {
        [SYMBOL_ID_EMPTY]: null,
        [SYMBOL_ID_FILL]: "cell-fill",
        [SYMBOL_ID_X]: "cell-x"
    };

    constructor(rows = 0, cols = 0, cellSize = 0) {
        this.drawCounter = new DrawCounter(rows, cols, cellSize);
        this.setSize(rows, cols, cellSize);

        // Preload images.
        this.imageCache["fill"] = new Image();
        this.imageCache["fill"].src = SVG_URL_FILL;
        this.imageCache["x"] = new Image();
        this.imageCache["x"].src = SVG_URL_X;
        this.imageCache["clue-slash"] = new Image();
        this.imageCache["clue-slash"].src = SVG_URL_CLUE_SLASH;
    }

    initialize() {
        this.drawCounter.initialize();

        this.cellElemsDict = {};
        for (let rowIdx = 0; rowIdx < this.rows; rowIdx++) {
            for (let colIdx = 0; colIdx < this.rows; colIdx++) {
                const cellId = getCellId(this.cols, rowIdx, colIdx);
                this.cellElemsDict[cellId] = document.getElementById(`cell-${cellId}`);
            }
        }

        this.crosshairElemsDict = {};
        for (let rowIdx = 0; rowIdx < this.rows; rowIdx++) {
            const key = `row-${rowIdx}`;
            const query = `.overlay.${key}`;
            const elems = document.querySelectorAll(query);
            this.crosshairElemsDict[key] = elems;
        }
        for (let colIdx = 0; colIdx < this.cols; colIdx++) {
            const key = `col-${colIdx}`;
            const query = `.overlay.${key}`;
            const elems = document.querySelectorAll(query);
            this.crosshairElemsDict[key] = elems;
        }

        this.clueOverlayElemsDict = {};
        const clueOverlays = document.querySelectorAll(".clue.overlay");
        clueOverlays.forEach(elem => {
            this.clueOverlayElemsDict[elem.id] = elem;
        });
    }

    setSize(rows, cols, cellSize) {
        this.rows = rows;
        this.cols = cols;
        this.cellSize = cellSize;
        this.drawCounter.setSize(rows, cols, cellSize);

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

    setClues(topClueRows, topClueData, leftClueCols, leftClueData) {
        this.topClueRows = topClueRows;
        this.topClueData = arr2dClone(topClueData);
        this.leftClueCols = leftClueCols;
        this.leftClueData = arr2dClone(leftClueData);
    }

    getCellElement(row, col) {
        const cellId = getCellId(this.cols, row, col);
        return this.cellElemsDict[cellId];
    }

    // DRAWING

    startDrawing(sRow, sCol, drawSymbol) {
        this.drawStartRow = sRow;
        this.drawStartCol = sCol;
        this.drawEndRow = sRow;
        this.drawEndCol = sCol;
        this.isDrawing = true;
        this.drawingDir = DRAWING_DIR_POINT;

        this.drawCounter.hide();

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
        const [newDrawCells, newEndRow, newEndCol, dir] = this.getDrawCells(eRow, eCol);
        this.drawEndRow = newEndRow;
        this.drawEndCol = newEndCol;
        this.drawingDir = dir;

        if (newDrawCells.size > 1) {
            const sCell = this.getCellElement(this.drawStartRow, this.drawStartCol);
            const eCell = this.getCellElement(newEndRow, newEndCol);
            this.drawCounter.update(this.drawStartRow, this.drawStartCol,
                newEndRow, newEndCol, this.board, this.drawSymbol, sCell, eCell);
        }

        this.renderDrawing(newDrawCells);
    }

    endDrawing() {
        this.isDrawing = false;
        this.drawCells.forEach(cellId => {
            const [row, col] = getCellRowCol(cellId, this.cols);
            this.board[row][col] = this.drawSymbol;
        });

        this.drawCounter.hide();
        this.renderDrawing();
    }

    renderDrawing(newDrawCells = null) {
        this.drawCells.forEach(cellId => {
            const [row, col] = getCellRowCol(cellId, this.cols);
            const cellSymbol = this.board[row][col];
            this.renderCell(cellId, cellSymbol, false);
        });

        let symbolId;
        this.drawCells.clear();
        if (newDrawCells !== null) {
            newDrawCells.forEach(cellId => {
                if (this.drawSymbol === SYMBOL_ID_EMPTY) {
                    const [row, col] = getCellRowCol(cellId, this.cols);
                    symbolId = this.board[row][col];
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
            return [drawCells, sRow, sCol, DRAWING_DIR_POINT];
        }
    
        const horiDelta = eCol - sCol;
        const vertDelta = eRow - sRow;
        const isVerticalDraw = Math.abs(vertDelta) > Math.abs(horiDelta);

        let dir;
        let newDrawEndRow = sRow;
        let newDrawEndCol = sCol;
    
        // Horizontal Draw
        if (isVerticalDraw === false) {
            dir = DRAWING_DIR_HORIZONTAL;
            let col = Math.min(sCol, eCol);
            let end = Math.max(sCol, eCol);
            newDrawEndCol = eCol;
            while (col <= end) {
                let cellId = getCellId(this.cols, sRow, col);
                drawCells.add(cellId);
                col += 1;
            }

        }
        // Vertical Draw
        else {
            dir = DRAWING_DIR_VERTICAL;
            let row = Math.min(sRow, eRow);
            let end = Math.max(sRow, eRow);
            newDrawEndRow = eRow;
            while (row <= end) {
                let cellId = getCellId(this.cols, row, sCol);
                drawCells.add(cellId);
                row += 1;
            }
        }
        
        return [drawCells, newDrawEndRow, newDrawEndCol, dir];
    }

    setCrosshair(rowIdx, colIdx) {
        this.crosshairRow = rowIdx;
        this.crosshairCol = colIdx;

        this.currCrosshairElems.forEach(elem => {
            elem.classList.remove(CLASSNAME_CROSSHAIR_ACTIVE);
        });
        this.currCrosshairElems.clear();

        if (rowIdx === null || colIdx === null) {
            return;
        }

        const key1 = `row-${rowIdx}`;
        const key2 = `col-${colIdx}`;
        if (this.crosshairElemsDict[key1]) {
            this.crosshairElemsDict[key1].forEach(elem => {
                elem.classList.add(CLASSNAME_CROSSHAIR_ACTIVE);
                this.currCrosshairElems.add(elem);
            });
        } else {
            console.error(`Failed to set crosshair, element '${key1}' not found.`);
        }
        if (this.crosshairElemsDict[key2]) {
            this.crosshairElemsDict[key2].forEach(elem => {
                elem.classList.add(CLASSNAME_CROSSHAIR_ACTIVE);
                this.currCrosshairElems.add(elem);
            });
        } else {
            console.error(`Failed to set crosshair, element '${key2}' not found.`);
        }
    }

    // CLUE DRAWING

    toggleTopClue(rowIdx, colIdx) {
        if (this.topClueData) {
            if (rowIdx >= 0 && rowIdx < this.topClueData.length) {
                if (colIdx >= 0 && colIdx < this.topClueData[rowIdx].length) {
                    if (this.topClueData[rowIdx][colIdx]) {
                        const idNum = getCellId(this.cols, rowIdx, colIdx);
                        const elemId = `top-clue-overlay-${idNum}`;
                        const elem = this.clueOverlayElemsDict[elemId];
                        elem.classList.toggle(CLASSNAME_CLUE_SLASH);
                    }
                }
            }
        }
    }

    toggleLeftClue(rowIdx, colIdx) {
        if (this.leftClueData) {
            if (rowIdx >= 0 && rowIdx < this.leftClueData.length) {
                if (colIdx >= 0 && colIdx < this.leftClueData[rowIdx].length) {
                    if (this.leftClueData[rowIdx][colIdx]) {
                        const idNum = getCellId(this.leftClueCols, rowIdx, colIdx);
                        const elemId = `left-clue-overlay-${idNum}`;
                        const elem = this.clueOverlayElemsDict[elemId];
                        elem.classList.toggle(CLASSNAME_CLUE_SLASH);
                    }
                }
            }
        }
    }
}

const nonogram = new Nonogram();
export default nonogram;