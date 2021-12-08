import { arr2dClone, getCellId, getCellRowCol } from "../utils";
import {
    CLASSNAME_CELL_CONTENT,
    CLASSNAME_CELL_DRAWING,
    CLASSNAME_CLUE_SLASH,
    CLASSNAME_CROSSHAIR_ACTIVE,
    CLASSNAME_TRANSITION,
    CLASSNAME_VISIBLE,
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
    drawCells = new Set();
    drawSymbol = null;
    drawStartRow = null;
    drawStartCol = null;
    drawEndRow = null;
    drawEndCol = null;
    currCrosshairElems = new Set();
    drawCounterElem = null;
    drawCounterText = "";
    imageCache = {}

    symbolClassNames = {
        [SYMBOL_ID_EMPTY]: null,
        [SYMBOL_ID_FILL]: "cell-fill",
        [SYMBOL_ID_X]: "cell-x"
    };

    constructor(rows = 0, cols = 0) {
        this.setSize(rows, cols);

        // Preload images.
        this.imageCache["fill"] = new Image();
        this.imageCache["fill"].src = SVG_URL_FILL;
        this.imageCache["x"] = new Image();
        this.imageCache["x"].src = SVG_URL_X;
        this.imageCache["clue-slash"] = new Image();
        this.imageCache["clue-slash"].src = SVG_URL_CLUE_SLASH;
    }

    initialize() {
        this.drawCounterElem = document.getElementById("draw-counter")

        this.cellElemsDict = {};
        for (let rowIdx = 0; rowIdx < this.rows; rowIdx++) {
            for (let colIdx = 0; colIdx < this.rows; colIdx++) {
                const cellId = getCellId(this.cols, rowIdx, colIdx);
                this.cellElemsDict[cellId] = document.getElementById(`cell_${cellId}`);
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

    setClues(topClueRows, topClueData, leftClueCols, leftClueData) {
        this.topClueRows = topClueRows;
        this.topClueData = arr2dClone(topClueData);
        this.leftClueCols = leftClueCols;
        this.leftClueData = arr2dClone(leftClueData);
    }

    // DRAWING

    startDrawing(sRow, sCol, drawSymbol) {
        this.drawStartRow = sRow;
        this.drawStartCol = sCol;
        this.drawEndRow = sRow;
        this.drawEndCol = sCol;
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
        const [newDrawCells, newEndRow, newEndCol] = this.getDrawCells(eRow, eCol);
        this.drawEndRow = newEndRow;
        this.drawEndCol = newEndCol;
        if (newDrawCells.size > 1) {
            this.drawCounterText = this.getDrawCounterText();
        }
        this.renderDrawing(newDrawCells);
    }

    endDrawing() {
        this.isDrawing = false;
        this.drawCells.forEach(cellId => {
            const [row, col] = getCellRowCol(cellId, this.cols);
            this.board[row][col] = this.drawSymbol;
        });
        this.drawCounterElem.classList.remove(CLASSNAME_VISIBLE);
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
            return drawCells;
        }
    
        const horiDelta = eCol - sCol;
        const vertDelta = eRow - sRow;
        const isVerticalDraw = Math.abs(vertDelta) > Math.abs(horiDelta);

        let newDrawEndRow = sRow;
        let newDrawEndCol = sCol;
    
        // Horizontal Draw
        if (isVerticalDraw === false) {
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
            let row = Math.min(sRow, eRow);
            let end = Math.max(sRow, eRow);
            newDrawEndRow = eRow;
            while (row <= end) {
                let cellId = getCellId(this.cols, row, sCol);
                drawCells.add(cellId);
                row += 1;
            }
        }
        
        return [drawCells, newDrawEndRow, newDrawEndCol];
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
        this.crosshairElemsDict[key1].forEach(elem => {
            elem.classList.add(CLASSNAME_CROSSHAIR_ACTIVE);
            this.currCrosshairElems.add(elem);
        });
        this.crosshairElemsDict[key2].forEach(elem => {
            elem.classList.add(CLASSNAME_CROSSHAIR_ACTIVE);
            this.currCrosshairElems.add(elem);
        });
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

    // DRAW COUNTER

    updateDrawCounter(cursorPosX, cursorPosY) {
        if (!this.isDrawing || this.drawCounterElem === null)
            return;

        if (this.drawCells.size < 2) {
            this.drawCounterElem.classList.remove(CLASSNAME_TRANSITION);
            this.drawCounterElem.classList.remove(CLASSNAME_VISIBLE);
            return;
        }

        const transform = `translate(${cursorPosX}px, ${cursorPosY}px)`;
        this.drawCounterElem.style.transform = transform;
        this.drawCounterElem.innerHTML = this.drawCounterText;

        if (!this.drawCounterElem.classList.contains(CLASSNAME_VISIBLE)) {
            this.drawCounterElem.classList.remove(CLASSNAME_TRANSITION);
            this.drawCounterElem.classList.add(CLASSNAME_VISIBLE);         
        }
        else {
            this.drawCounterElem.classList.add(CLASSNAME_TRANSITION);
        }
    }

    getDrawCounterText() {
        let row, col, actualCount, totalCount;

        // Horizontal draw.
        if (this.drawStartRow === this.drawEndRow) {
            row = this.drawStartRow;
            actualCount = Math.abs(this.drawEndCol - this.drawStartCol) + 1;
            totalCount = actualCount;

            if (this.drawSymbol === SYMBOL_ID_EMPTY) {
                return actualCount;
            }

            col = Math.min(this.drawEndCol, this.drawStartCol) - 1;
            while (col >= 0 && this.board[row][col] === this.drawSymbol) {
                totalCount += 1;
                col -= 1;
            }

            col = Math.max(this.drawEndCol, this.drawStartCol) + 1;
            while (col < this.cols && this.board[row][col] === this.drawSymbol) {
                totalCount += 1;
                col += 1;
            }

            if (actualCount === totalCount) {
                return actualCount;
            }
            else {
                return `${actualCount}/${totalCount}`;
            }
        }
        // Vertical draw.
        else {
            col = this.drawStartCol;
            actualCount = Math.abs(this.drawEndRow - this.drawStartRow) + 1;
            totalCount = actualCount;

            if (this.drawSymbol === SYMBOL_ID_EMPTY) {
                return actualCount;
            }

            row = Math.min(this.drawEndRow, this.drawStartRow) - 1;
            while (row >= 0 && this.board[row][col] === this.drawSymbol) {
                totalCount += 1;
                row -= 1;
            }

            row = Math.max(this.drawEndRow, this.drawStartRow) + 1;
            while (row < this.cols && this.board[row][col] === this.drawSymbol) {
                totalCount += 1;
                row += 1;
            }

            if (actualCount === totalCount) {
                return actualCount;
            }
            else {
                return `${actualCount}/${totalCount}`;
            }
        }
    }
}

const nonogram = new Nonogram();
export default nonogram;