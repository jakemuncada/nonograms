import { CLASSNAME_CROSSHAIR_ACTIVE } from "../common/constants";


/** Class responsible for displaying the board crosshair. */
export default class CrosshairManager {

    /**
     * The puzzle object.
     * @type {Puzzle}
     */
    puzzle = null;

    /**
     * The dictionary containing the DOM elements of each cell overlay.
     * @type {Object<string, HTMLElement>}
     */
    elemsDict = {};

    /**
     * The set containing the DOM elements of the cells activated by the crosshair.
     * @type {Set<HTMLElement>}
     */
    currCrosshairElems = new Set();

    /**
     * The row index of the cell where the crosshair is targeting.
     * @type {number}
     */
    currRow = null;

    /**
     * The column index of the cell where the crosshair is targeting.
     * @type {number}
     */
    currCol = null;

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
        this.elemsDict = {};
        this.currCrosshairElems.clear();
        for (let rowIdx = 0; rowIdx < this.puzzle.rows; rowIdx++) {
            const key = `row-${rowIdx}`;
            const query = `.overlay.${key}`;
            const elems = document.querySelectorAll(query);
            this.elemsDict[key] = elems;
        }
        for (let colIdx = 0; colIdx < this.puzzle.cols; colIdx++) {
            const key = `col-${colIdx}`;
            const query = `.overlay.${key}`;
            const elems = document.querySelectorAll(query);
            this.elemsDict[key] = elems;
        }
    }

    /**
     * Clear the active crosshair overlay.
     */
    hide() {
        this.currCrosshairElems.forEach(elem => {
            elem.classList.remove(CLASSNAME_CROSSHAIR_ACTIVE);
        });
        this.currCrosshairElems.clear();
    }

    /**
     * Target a cell on the grid and show the crosshair.
     * @param {number} rowIdx The row index of the cell where the crosshair is targeting.
     * @param {number} colIdx The column index of the cell where the crosshair is targeting.
     */
    target(rowIdx, colIdx) {
        this.currRow = rowIdx;
        this.currCol = colIdx;
        this.render(rowIdx, colIdx);
    }

    /**
     * Target a row and show the crosshair.
     * @param {number} rowIdx The row index to target.
     */
    targetRow(rowIdx) {
        this.currRow = rowIdx;
        this.currCol = null;
        this.render(rowIdx, null);
    }

    /**
     * Target a column and show the crosshair.
     * @param {number} colIdx The column index to target.
     */
    targetCol(colIdx) {
        this.currRow = null;
        this.currCol = colIdx;
        this.render(null, colIdx);
    }

    /**
     * Render the crosshair.
     * @param {number} [rowIdx=null] The row index where the crosshair is located. Optional.
     * @param {number} [colIdx=null] The column index where the crosshair is located. Optional.
     */
    render(rowIdx = null, colIdx = null) {
        // Hide the crosshair.
        this.hide();

        // If the given rowIdx is not null, draw the crosshair overlay on that row.
        if (rowIdx !== null) {
            if (rowIdx < 0 || rowIdx >= this.puzzle.rows) {
                console.error("Failed to render row crosshair, row is invalid:", rowIdx);
            }
            else {
                const key1 = `row-${rowIdx}`;
                if (this.elemsDict[key1]) {
                    this.elemsDict[key1].forEach(elem => {
                        elem.classList.add(CLASSNAME_CROSSHAIR_ACTIVE);
                        this.currCrosshairElems.add(elem);
                    });
                } else {
                    console.error(`Failed to set crosshair, element '${key1}' not found.`);
                }
            }
        }

        // If the given colIdx is not null, draw the crosshair overlay on that column.
        if (colIdx !== null) {
            if (colIdx < 0 || colIdx >= this.puzzle.cols) {
                console.error("Failed to render row crosshair, col is invalid:", colIdx);
            }
            else {
                const key2 = `col-${colIdx}`;
                if (this.elemsDict[key2]) {
                    this.elemsDict[key2].forEach(elem => {
                        elem.classList.add(CLASSNAME_CROSSHAIR_ACTIVE);
                        this.currCrosshairElems.add(elem);
                    });
                } else {
                    console.error(`Failed to set crosshair, element '${key2}' not found.`);
                }
            }
        }
    }
}