// eslint-disable-next-line
import ElementManager from "./ElementManager";
import { getSelectionInfo } from "../common/utils";

/** Class responsible for the rulers and its measurement tooltips. */
export default class RulerManager {

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
     * True if currently measuring. False otheriwse.
     * @type {boolean}
     */
    isMeasuring = false;

    /**
     * The row index of the cell where the measurement started.
     * @type {number}
     */
    sRow = null;

    /**
     * The column index of the cell where the measurement started.
     * @type {number}
     */
    sCol = null;

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
     * Hide all rulers.
     */
    hideAll() {
        this.hideHorizontal();
        this.hideVertical();
    }

    /**
     * Hide the horizontal rulers.
     */
    hideHorizontal() {
        this.elemMgr.rulerRectH.style.visibility = "hidden";
    }

    /**
     * Hide the vertical rulers.
     */
    hideVertical() {
        this.elemMgr.rulerRectV.style.visibility = "hidden";
    }

    /**
     * Show all rulers.
     */
    showAll() {
        this.showHorizontal();
        this.showVertical();
    }

    /**
     * Show the horizontal rulers.
     */
    showHorizontal() {
        this.elemMgr.rulerRectH.style.visibility = "visible";
    }

    /**
     * Show the vertical rulers.
     */
    showVertical() {
        this.elemMgr.rulerRectV.style.visibility = "visible";
    }

    start(rowIdx, colIdx) {
        this.sRow = rowIdx;
        this.sCol = colIdx;
        this.isMeasuring = true;
    }

    move(rowIdx, colIdx) {
        if (!this.isMeasuring)
            return;

        // If the cursor is back to the starting cell.
        if (rowIdx === this.sRow && colIdx === this.sCol) {
            this.hideAll();
            return;
        }

        const [_, eRow, eCol, selectionDir] =
            getSelectionInfo(this.sRow, this.sCol, rowIdx, colIdx, this.puzzle.cols);

        const rectElem = this.elemMgr.rulerRectH;
        this.renderRect(rectElem, this.sRow, this.sCol, eRow, eCol);

        this.showHorizontal();
    }

    end() {
        this.isMeasuring = false;
        this.sRow = null;
        this.sCol = null;

        console.log("Width:", this.elemMgr.rulerRectH.style.width);
        console.log("Height:", this.elemMgr.rulerRectH.style.height);
    }

    measureLine(sRow, sCol, eRow, eCol) {

    }

    renderRect(rectElem, sRow, sCol, eRow, eCol) {
        const sElem = this.elemMgr.getCell(sRow, sCol);
        const eElem = this.elemMgr.getCell(eRow, eCol);

        const sRect = sElem.getBoundingClientRect();
        const eRect = eElem.getBoundingClientRect();

        const top = Math.min(sRect.top, eRect.top);
        const left = Math.min(sRect.left, eRect.left);
        const width = (Math.max(sRect.right, eRect.right) - left) - 4;
        const height = (Math.max(sRect.bottom, eRect.bottom) - top) - 4;
        const translate = `translate(${left}px, ${top}px)`;

        console.log("sRect:", sRect);
        console.log("eRect:", eRect);
        console.log("Setting top, left to:", top, ":", left);
        console.log("Setting width, height to:", width, ":", height);

        rectElem.style.width = `${width}px`;
        rectElem.style.height = `${height}px`;
        rectElem.style.transform = translate;
    }

    getRectWidth(sRow, sCol, eRow, eCol, sRect, eRect, dir) {

    }

    getRectHTop(sRow, eRow) {
        const targetRow = (sRow < eRow) ? sRow : eRow;
        const cellElem = this.elemMgr.getCell(targetRow, 0);
        const cellRect = cellElem.getBoundingClientRect();
        console.log("Cell", targetRow, 0, ":  ", cellElem.style.borderWidth);
        return cellRect.top;
    }

    getRectHLeft(sCol, eCol) {
        const targetCol = (sCol < eCol) ? sCol : eCol;
        const cellElem = this.elemMgr.getCell(0, targetCol);
        const cellRect = cellElem.getBoundingClientRect();
        return cellRect.left;
    }

}