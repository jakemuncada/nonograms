import { CLASSNAME_CLUE_SLASH } from "../common/constants";
import { getCellId } from "../common/utils";


/** Class responsible for handling the clues. */
export default class ClueManager {

    /**
     * The puzzle object.
     * @type {Puzzle}
     */
    puzzle = null;

    /**
     * The dictionary containing the DOM elements of the clues.
     * @type {Object<string, HTMLElement>}
     */
    elemsDict = {};

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
        const clueOverlays = document.querySelectorAll(".clue.overlay");
        clueOverlays.forEach(elem => {
            this.elemsDict[elem.id] = elem;
        });
    }

    /**
     * Toggle the clue in the top panel.
     * @param {number} rowIdx The row index of the clue.
     * @param {column} colIdx The column index of the clue.
     */
    toggleTopClue(rowIdx, colIdx) {
        if (this.puzzle.topClueData) {
            if (rowIdx >= 0 && rowIdx < this.puzzle.topClueData.length) {
                if (colIdx >= 0 && colIdx < this.puzzle.topClueData[rowIdx].length) {
                    if (this.puzzle.topClueData[rowIdx][colIdx]) {
                        const idNum = getCellId(this.puzzle.cols, rowIdx, colIdx);
                        const elemId = `top-clue-overlay-${idNum}`;
                        const elem = this.elemsDict[elemId];
                        elem.classList.toggle(CLASSNAME_CLUE_SLASH);
                    }
                }
            }
        }
    }

    /**
     * Toggle the clue in the left panel.
     * @param {number} rowIdx The row index of the clue.
     * @param {column} colIdx The column index of the clue.
     */
    toggleLeftClue(rowIdx, colIdx) {
        if (this.puzzle.leftClueData) {
            if (rowIdx >= 0 && rowIdx < this.puzzle.leftClueData.length) {
                if (colIdx >= 0 && colIdx < this.puzzle.leftClueData[rowIdx].length) {
                    if (this.puzzle.leftClueData[rowIdx][colIdx]) {
                        const idNum = getCellId(this.puzzle.leftClueCols, rowIdx, colIdx);
                        const elemId = `left-clue-overlay-${idNum}`;
                        const elem = this.elemsDict[elemId];
                        elem.classList.toggle(CLASSNAME_CLUE_SLASH);
                    }
                }
            }
        }
    }
}