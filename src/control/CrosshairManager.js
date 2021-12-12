import { CLASSNAME_CROSSHAIR_ACTIVE } from "../common/constants";


/** Class responsible for displaying the board crosshair. */
export default class CrosshairManager {

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
     * @param {ElementManager} elemMgr The ElementManager.
     */
    constructor(puzzle, elemMgr) {
        this.puzzle = puzzle;
        this.elemMgr = elemMgr;
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
            try {
                const elems = this.elemMgr.getCellOverlaysAtRow(rowIdx);
                elems.forEach(elem => {
                    elem.classList.add(CLASSNAME_CROSSHAIR_ACTIVE);
                    this.currCrosshairElems.add(elem);
                });
            } catch (e) {
                console.error("Failed to set crosshair,", e);
            }
        }

        // If the given colIdx is not null, draw the crosshair overlay on that column.
        if (colIdx !== null) {
            try {
                const elems = this.elemMgr.getCellOverlaysAtCol(colIdx);
                elems.forEach(elem => {
                    elem.classList.add(CLASSNAME_CROSSHAIR_ACTIVE);
                    this.currCrosshairElems.add(elem);
                });
            } catch (e) {
                console.error("Failed to set crosshair,", e);
            }
        }
    }
}