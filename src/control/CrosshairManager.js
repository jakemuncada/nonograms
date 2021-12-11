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
    clear() {
        this.currCrosshairElems.forEach(elem => {
            elem.classList.remove(CLASSNAME_CROSSHAIR_ACTIVE);
        });
        this.currCrosshairElems.clear();
    }

    /**
     * Show the crosshair.
     * @param {number} rowIdx The row index of the cell where the crosshair is targeting.
     * @param {number} colIdx The column index of the cell where the crosshair is targeting.
     */
    show(rowIdx, colIdx) {
        this.currRow = rowIdx;
        this.currCol = colIdx;

        this.clear();

        if (rowIdx === null || colIdx === null) {
            console.error("Failed to show crosshair, invalid row and column index, ", rowIdx, colIdx);
        }

        const key1 = `row-${rowIdx}`;
        const key2 = `col-${colIdx}`;
        if (this.elemsDict[key1]) {
            this.elemsDict[key1].forEach(elem => {
                elem.classList.add(CLASSNAME_CROSSHAIR_ACTIVE);
                this.currCrosshairElems.add(elem);
            });
        } else {
            console.error(`Failed to set crosshair, element '${key1}' not found.`);
        }
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