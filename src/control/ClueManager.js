import { CLASSNAME_CLUE_SLASH } from "../constants";
import { getCellId } from "../utils";

export default class ClueManager {

    clueOverlayElemsDict = {};

    constructor(puzzle) {
        this.puzzle = puzzle;
    }

    initialize() {
        this.clueOverlayElemsDict = {};
        const clueOverlays = document.querySelectorAll(".clue.overlay");
        clueOverlays.forEach(elem => {
            this.clueOverlayElemsDict[elem.id] = elem;
        });
    }

    toggleTopClue(rowIdx, colIdx) {
        if (this.puzzle.topClueData) {
            if (rowIdx >= 0 && rowIdx < this.puzzle.topClueData.length) {
                if (colIdx >= 0 && colIdx < this.puzzle.topClueData[rowIdx].length) {
                    if (this.puzzle.topClueData[rowIdx][colIdx]) {
                        const idNum = getCellId(this.puzzle.cols, rowIdx, colIdx);
                        const elemId = `top-clue-overlay-${idNum}`;
                        const elem = this.clueOverlayElemsDict[elemId];
                        elem.classList.toggle(CLASSNAME_CLUE_SLASH);
                    }
                }
            }
        }
    }

    toggleLeftClue(rowIdx, colIdx) {
        if (this.puzzle.leftClueData) {
            if (rowIdx >= 0 && rowIdx < this.puzzle.leftClueData.length) {
                if (colIdx >= 0 && colIdx < this.puzzle.leftClueData[rowIdx].length) {
                    if (this.puzzle.leftClueData[rowIdx][colIdx]) {
                        const idNum = getCellId(this.puzzle.leftClueCols, rowIdx, colIdx);
                        const elemId = `left-clue-overlay-${idNum}`;
                        const elem = this.clueOverlayElemsDict[elemId];
                        elem.classList.toggle(CLASSNAME_CLUE_SLASH);
                    }
                }
            }
        }
    }
}