import { ClueTypeEnum } from "../common/enums";
import { getCellId } from "../common/utils";
import {
    ELEM_ID_DRAW_TOOLTIP,
    ELEM_ID_RULER_HORIZONTAL,
    ELEM_ID_RULER_VERTICAL
} from "../common/constants";

/** Class responsible for storing the DOM elements. */
export default class ElementManager {

    /**
     * The puzzle object.
     * @type {Puzzle}
     */
    puzzle = null;

    /**
     * The dictionary containing the DOM elements of the cells.
     * @type {Object<string, HTMLElement>}
     */
    cells = {}

    /**
     * The dictionary containing the DOM elements of the cell-contents.
     * @type {Object<string, HTMLElement>}
     */
    cellContents = {}

    /** 
     * The DOM element of the draw tooltip.
     * @type {HTMLElement}
     */
    drawCountTooltipMain = null;

    /** 
     * The DOM element of the draw tooltip's text.
     * @type {HTMLElement}
     */
    drawCountTooltipText = null;

    /**
     * The dictionary containing the DOM elements of the clue overlays.
     * @type {Object<string, HTMLElement>}
     */
    clueOverlays = {};

    /**
     * The dictionary containing the DOM elements of the cell overlays at each row or column.
     * @type {Object<string, NodeListOf<Element>}
     */
    cellOverlaysRowCol = {};

    /**
     * The rect element for the vertical ruler.
     * @type {HTMLElement}
     */
    rulerRectV = null;

    /**
     * The rect element for the horizontal ruler.
     * @type {HTMLElement}
     */
    rulerRectH = null;

    /**
     * Constructor.
     * @param {Puzzle} puzzle The puzzle object.
     */
    constructor(puzzle) {
        this.puzzle = puzzle;
    }

    /**
     * Initialize the elements.
     * Should be called once the DOM elements have been loaded.
     */
    initialize() {
        // Initialize the cells.
        this.cells = {};
        for (let rowIdx = 0; rowIdx < this.puzzle.rows; rowIdx++) {
            for (let colIdx = 0; colIdx < this.puzzle.rows; colIdx++) {
                const idNum = this.puzzle.getCellId(rowIdx, colIdx);
                const cellId = `cell-${idNum}`;
                const contentId = `cellcontent-${idNum}`;
                this.cells[cellId] = document.getElementById(cellId);
                this.cellContents[contentId] = document.getElementById(contentId);
            }
        }

        // Initialize the DrawCount tooltip.
        this.drawCountTooltipMain = document.getElementById(ELEM_ID_DRAW_TOOLTIP);
        this.drawCountTooltipText = document.getElementById(ELEM_ID_DRAW_TOOLTIP + "-text");

        // Initialize the clue overlays.
        this.clueOverlays = {};
        const clueOverlays = document.querySelectorAll(".clue.overlay");
        clueOverlays.forEach(elem => {
            this.clueOverlays[elem.id] = elem;
        });

        // Initialize the cell overlays.
        this.cellOverlaysRowCol = {};
        for (let rowIdx = 0; rowIdx < this.puzzle.rows; rowIdx++) {
            const key = `row-${rowIdx}`;
            const query = `.overlay.${key}`;
            const elems = document.querySelectorAll(query);
            this.cellOverlaysRowCol[key] = elems;
        }
        for (let colIdx = 0; colIdx < this.puzzle.cols; colIdx++) {
            const key = `col-${colIdx}`;
            const query = `.overlay.${key}`;
            const elems = document.querySelectorAll(query);
            this.cellOverlaysRowCol[key] = elems;
        }

        // Initialize the ruler rects.
        this.rulerRectV = document.getElementById(ELEM_ID_RULER_VERTICAL);
        this.rulerRectH = document.getElementById(ELEM_ID_RULER_HORIZONTAL);
    }

    /**
     * Get the DOM element of the specified cell.
     * @param {number} rowIdx The row index of the cell.
     * @param {number} colIdx The column index of the cell.
     * @returns {HTMLElement} The cell's DOM element.
     */
    getCell(rowIdx, colIdx) {
        if (rowIdx < 0 || rowIdx >= this.puzzle.rows ||
            colIdx < 0 || colIdx >= this.puzzle.rows) {
            throw new RangeError("Invalid row/column index,", rowIdx, colIdx);
        }
        const idNum = this.puzzle.getCellId(rowIdx, colIdx);
        const cellId = "cell-" + idNum;
        return this.cells[cellId];
    }

    /**
     * Get the DOM element of the content of the specified cell.
     * @param {number} rowIdx The row index of the cell.
     * @param {number} colIdx The column index of the cell.
     * @returns {HTMLElement} The cell-content DOM element.
     */
    getCellContent(rowIdx, colIdx) {
        if (rowIdx < 0 || rowIdx >= this.puzzle.rows ||
            colIdx < 0 || colIdx >= this.puzzle.rows) {
            throw new RangeError("Invalid row/column index,", rowIdx, colIdx);
        }
        const idNum = this.puzzle.getCellId(rowIdx, colIdx);
        const cellId = "cellcontent-" + idNum;
        return this.cellContents[cellId];
    }

    /**
     * Get the DOM element of the content of the specified cell.
     * @param {number} idNum The id number of the cell.
     * @returns {HTMLElement} The cell-content DOM element.
     */
    getCellContentById(idNum) {
        const cellId = "cellcontent-" + idNum;
        return this.cellContents[cellId];
    }

    /**
     * Get the list of cell overlays at the given row.
     * @param {number} rowIdx The row index.
     * @returns {NodeListOf<HTMLElement>} The list of cell overlays at the given row.
     */
    getCellOverlaysAtRow(rowIdx) {
        if (rowIdx < 0 || rowIdx >= this.puzzle.rows) {
            throw new RangeError("Invalid row index,", rowIdx);
        }
        const key = `row-${rowIdx}`;
        return this.cellOverlaysRowCol[key];
    }

    /**
     * Get the list of cell overlays at the given column.
     * @param {number} colIdx The column index.
     * @returns {NodeListOf<HTMLElement>} The list of cell overlays at the given column.
     */
    getCellOverlaysAtCol(colIdx) {
        if (colIdx < 0 || colIdx >= this.puzzle.rows) {
            throw new RangeError("Invalid column index,", colIdx);
        }
        const key = `col-${colIdx}`;
        return this.cellOverlaysRowCol[key];
    }

    /**
     * Get the DOM element of overlay of the specified clue.
     * @param {ClueTypeEnum} clueType The clue type.
     * @param {number} rowIdx The row index of the clue.
     * @param {number} colIdx The column index of the clue.
     * @returns The DOM element of the clue overlay.
     */
    getClueOverlay(clueType, rowIdx, colIdx) {
        if (rowIdx < 0 || rowIdx >= this.puzzle.rows ||
            colIdx < 0 || colIdx >= this.puzzle.rows) {
            throw new RangeError("Invalid row/column index,", rowIdx, colIdx);
        }

        let prefix = "";
        let clueCols = 0;

        if (clueType === ClueTypeEnum.TOP) {
            prefix = "top";
            clueCols = this.puzzle.topClueCols;
        } else if (clueType === ClueTypeEnum.LEFT) {
            prefix = "left";
            clueCols = this.puzzle.leftClueCols;
        } else {
            throw new TypeError("Invalid clue type:", clueType);
        }

        const idNum = getCellId(clueCols, rowIdx, colIdx);
        const elemId = `${prefix}-clue-overlay-${idNum}`;
        const elem = this.clueOverlays[elemId];

        return elem;
    }

}