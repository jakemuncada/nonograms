// eslint-disable-next-line
import ElementManager from "./ElementManager";
import DrawCountManager from "./DrawCountManager";
import { SelectionDirEnum, DrawingSymbolEnum } from "../common/enums";
import {
    CLASSNAME_CELL_CONTENT,
    CLASSNAME_CELL_DRAWING,
} from "../common/constants";
import { getSelectionInfo } from "../common/utils";


const SYMBOL_CLASSNAMES = {
    [DrawingSymbolEnum.EMPTY]: null,
    [DrawingSymbolEnum.FILL]: "cell-fill",
    [DrawingSymbolEnum.X]: "cell-x"
};


/**
 * Class responsible for the drawing process.
 */
export default class DrawManager {

    /**
     * The puzzle object.
     * @type {Puzzle}
     */
    puzzle = null;

    /**
     * The ElementManager containing the DOM elements.
     * @type {ElementManager}
     */
    elemMgr = null;

    /**
     * The DrawCountManager.
     * @type {DrawCountManager}
     */
    countMgr = null;

    /**
     * True if currently drawing a line. False otherwise.
     * @type {boolean}
     */
    isDrawing = false;

    /**
     * The current drawing direction.
     * @type {SelectionDirEnum}
     */
    drawingDir = SelectionDirEnum.NONE;

    /**
     * The symbol currently being drawn.
     * @type {DrawingSymbolEnum}
     */
    drawSymbol = DrawingSymbolEnum.FILL;

    /**
     * The selected symbol to be drawn when the user starts drawing.
     * @type {DrawingSymbolEnum}
     */
    selectedSymbol = DrawingSymbolEnum.FILL;

    /**
     * The set containing the DOM elements of the cells that are currently being drawn on.
     * @type {Set<HTMLElement>}
     */
    drawCells = new Set();

    /**
     * The row index of the cell where the drawn line starts from.
     * @type {number}
     */
    sRow = null;

    /**
     * The column index of the cell where the drawn line starts from.
     * @type {number}
     */
    sCol = null;

    /**
     * The row index of the cell where the drawn line ends on.
     * @type {number}
     */
    eRow = null;

    /**
     * The column index of the cell where the drawn line ends on.
     * @type {number}
     */
    eCol = null;

    /**
     * Constructor.
     * @param {Puzzle} puzzle The puzzle object.
     * @param {ElementManager} elemMgr The ElementManager.
     */
    constructor(puzzle, elemMgr) {
        this.puzzle = puzzle;
        this.elemMgr = elemMgr;
        this.countMgr = new DrawCountManager(puzzle, elemMgr);
    }

    /**
     * Start drawing.
     * @param {number} sRow The row index of the cell where the drawing starts from.
     * @param {number} sCol The column index of the cell where the drawing starts from.
     * @param {DrawingSymbolEnum} drawSymbol The symbol being drawn.
     */
    start(sRow, sCol, drawSymbol) {
        this.sRow = sRow;
        this.sCol = sCol;
        this.eRow = sRow;
        this.eCol = sCol;
        this.isDrawing = true;
        this.drawingDir = SelectionDirEnum.POINT;

        this.countMgr.hide();

        this.drawCells.clear();
        const newDrawCells = new Set();
        newDrawCells.add(this.puzzle.getCellId(sRow, sCol))

        const cellSymbol = this.puzzle.board[sRow][sCol];

        if (drawSymbol === DrawingSymbolEnum.EMPTY) {
            this.drawSymbol = DrawingSymbolEnum.EMPTY;
        }
        else if (drawSymbol === cellSymbol) {
            this.drawSymbol = DrawingSymbolEnum.EMPTY;
        }
        else {
            this.drawSymbol = drawSymbol;
        }

        this.renderDrawing(newDrawCells);
    }

    /**
     * Update the drawing when the cursor moves over another cell.
     * @param {number} currRow The row index of the cell where the cursor is currently on.
     * @param {number} currCol The column index of the cell where the cursor is currently on.
     */
    move(currRow, currCol) {
        const [newDrawCells, newEndRow, newEndCol, dir] = this.getDrawnCellsInfo(currRow, currCol);
        this.eRow = newEndRow;
        this.eCol = newEndCol;
        this.drawingDir = dir;

        if (newDrawCells.size > 1) {
            const sCell = this.elemMgr.getCell(this.sRow, this.sCol);
            const eCell = this.elemMgr.getCell(newEndRow, newEndCol);
            this.countMgr.update(this.sRow, this.sCol,
                newEndRow, newEndCol, this.puzzle.board, this.drawSymbol, sCell, eCell);
        }
        this.renderDrawing(newDrawCells);
    }

    /**
     * Finalize the drawing.
     */
    end() {
        this.isDrawing = false;
        this.drawingDir = SelectionDirEnum.NONE;
        // Finalize the drawn cells by reflecting the changes onto the actual board.
        this.drawCells.forEach(cellId => {
            const [row, col] = this.puzzle.getCellRowCol(cellId);
            this.puzzle.board[row][col] = this.drawSymbol;
        });

        this.countMgr.hide();
        this.renderDrawing();
    }

    /**
     * Cancel the drawing.
     */
    cancel() {
        this.isDrawing = false;
        this.drawingDir = SelectionDirEnum.NONE;
        this.countMgr.hide();
        this.renderDrawing();
    }

    /**
     * Render the drawing.
     * @param {Set<number>} newDrawCells The set containing the IDs of the cells being drawn on.
     */
    renderDrawing(newDrawCells = null) {
        this.drawCells.forEach(cellId => {
            const [row, col] = this.puzzle.getCellRowCol(cellId);
            const cellSymbol = this.puzzle.board[row][col];
            this.renderCell(cellId, cellSymbol, false);
        });

        let symbolId;
        this.drawCells.clear();
        if (newDrawCells !== null) {
            newDrawCells.forEach(cellId => {
                if (this.drawSymbol === DrawingSymbolEnum.EMPTY) {
                    const [row, col] = this.puzzle.getCellRowCol(cellId);
                    symbolId = this.puzzle.board[row][col];
                } else {
                    symbolId = this.drawSymbol;
                }
                this.renderCell(cellId, symbolId, true);
            });
        }
    }

    /**
     * Render a specific cell.
     * @param {number} cellId The cell id.
     * @param {DrawingSymbolEnum} symbolId The symbol to render on the cell.
     * @param {boolean} isDrawing True if the cell is being drawn on. False otherwise.
     */
    renderCell(cellId, symbolId, isDrawing) {
        const elem = this.elemMgr.getCellContentById(cellId);
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
        else {
            console.error(`Failed to render cell ${cellId}, cannot find cell.`);
        }
    }

    /**
     * Calculate and return an array containing the following:
     * 
     * - The set containing the IDs of the cells being drawn on.
     * - The row index of the cell where the drawing ends.
     * - The column index of the cell where the drawing ends.
     * - The drawing direction.
     * 
     * @param {number} currRow The row index of the cell where the cursor is currently on.
     * @param {number} currCol The column index of the cell where the cursor is currently on.
     * @returns {Array} The array of items as described above.
     */
    getDrawnCellsInfo(currRow, currCol) {
        return getSelectionInfo(this.sRow, this.sCol, currRow, currCol, this.puzzle.cols);
    }
}