import { CLASSNAME_CROSSHAIR_ACTIVE } from "../common/constants";


export default class CrosshairManager {

    puzzle = null;

    crosshairElemsDict = {};

    currCrosshairElems = new Set();

    currRow = null;

    currCol = null;

    constructor(puzzle) {
        this.puzzle = puzzle;
    }

    initialize() {
        this.cellElemsDict = {};
        for (let rowIdx = 0; rowIdx < this.puzzle.rows; rowIdx++) {
            for (let colIdx = 0; colIdx < this.puzzle.rows; colIdx++) {
                const cellId = this.puzzle.getCellId(rowIdx, colIdx);
                this.cellElemsDict[cellId] = document.getElementById(`cell-${cellId}`);
            }
        }

        this.crosshairElemsDict = {};
        for (let rowIdx = 0; rowIdx < this.puzzle.rows; rowIdx++) {
            const key = `row-${rowIdx}`;
            const query = `.overlay.${key}`;
            const elems = document.querySelectorAll(query);
            this.crosshairElemsDict[key] = elems;
        }
        for (let colIdx = 0; colIdx < this.puzzle.cols; colIdx++) {
            const key = `col-${colIdx}`;
            const query = `.overlay.${key}`;
            const elems = document.querySelectorAll(query);
            this.crosshairElemsDict[key] = elems;
        }
    }

    clear() {
        this.currCrosshairElems.forEach(elem => {
            elem.classList.remove(CLASSNAME_CROSSHAIR_ACTIVE);
        });
        this.currCrosshairElems.clear();
    }

    show(rowIdx, colIdx) {
        this.currRow = rowIdx;
        this.currCol = colIdx;

        this.clear();

        if (rowIdx === null || colIdx === null) {
            console.error("Failed to show crosshair, invalid row and column index, ", rowIdx, colIdx);
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
}