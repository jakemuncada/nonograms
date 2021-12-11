import { CLASSNAME_CLUE_SLASH } from "../common/constants";
import { ClueStatusEnum, ClueTypeEnum } from "../common/enums";
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
     * True if toggling of clues is currently going on. False otherwise.
     * @type {boolean}
     */
    isToggling = false;

    /**
     * The type of clue (top/left) where the toggling is ongoing.
     * @type {ClueTypeEnum}
     */
    togglingClueType = null;

    /**
     * The clue status actively toggling to.
     * @type {ClueStatusEnum}
     */
    togglingClueStatus = ClueStatusEnum.FINISHED;

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
     * Start toggling the clues.
     * @param {ClueTypeEnum} clueType The clue type.
     * @param {number} row The row index of the clue.
     * @param {number} col The column index of the clue.
     */
    startToggling(clueType, row, col) {
        try {
            const { state } = this.getClueInfo(clueType);
            const currStatus = state[row][col];

            // If the user started toggling on a BLANK (no number) clue cell, do nothing.
            if (currStatus === ClueStatusEnum.BLANK) {
                return;
            }

            this.isToggling = true;
            this.togglingClueType = clueType;
            this.togglingClueStatus = (currStatus === ClueStatusEnum.UNFINISHED) ?
                ClueStatusEnum.FINISHED : ClueStatusEnum.UNFINISHED;

            this.setClueStatus(clueType, row, col, this.togglingClueStatus);

        } catch (e) {
            console.error("Failed to start clue toggling,", e);
        }
    }

    /**
     * Continue toggling clues.
     * @param {ClueTypeEnum} clueType 
     * @param {*} row 
     * @param {*} col 
     */
    continueToggling(clueType, row, col) {
        // If not currently toggling, do nothing.
        if (!this.isToggling) {
            return;
        }

        // If the clue type does not match the clue type that was started, do nothing.
        if (clueType !== this.togglingClueType) {
            return;
        }

        this.setClueStatus(this.togglingClueType, row, col, this.togglingClueStatus);
    }

    /**
     * Stop toggling clues.
     */
    stopToggling() {
        this.isToggling = false;
        this.togglingClueType = null;
    }

    /**
     * Set the status of a clue in the top panel.
     * @param {number} rowIdx The row index of the clue.
     * @param {number} colIdx The column index of the clue.
     * @param {ClueStatusEnum} status The new clue status.
     */
    setTopClue(rowIdx, colIdx, status) {
        try {
            this.setClueStatus(ClueTypeEnum.TOP, rowIdx, colIdx, status);
        } catch (e) {
            console.error("Failed to set top clue,", e);
        }
    }

    /**
     * Set the status of a clue in the left panel.
     * @param {number} rowIdx The row index of the clue.
     * @param {number} colIdx The column index of the clue.
     * @param {ClueStatusEnum} status The new clue status.
     */
    setLeftClue(rowIdx, colIdx, status) {
        try {
            this.setClueStatus(ClueTypeEnum.LEFT, rowIdx, colIdx, status);
        } catch (e) {
            console.error("Failed to set top clue,", e);
        }
    }

    /**
     * Set the clue status.
     * @param {ClueTypeEnum} clueType The clue type.
     * @param {number} row The row index of the clue.
     * @param {number} col The column index of the clue.
     * @param {ClueStatusEnum} status The new clue status.
     */
    setClueStatus(clueType, row, col, status) {
        const { rows, cols, state } = this.getClueInfo(clueType);

        if (row < 0 || row >= rows || col < 0 || col >= cols) {
            throw new Error(`Invalid row/column: ${row}, ${col}.`);
        }

        // If there is no clue in the cell (if the cell has no number), do nothing.
        if (state[row][col] === ClueStatusEnum.BLANK) {
            return;
        }

        // Set the status.
        state[row][col] = status;
        // Render the new clue.
        this.renderClue(clueType, row, col);
    }

    /**
     * Render the clue.
     * @param {ClueTypeEnum} clueType The clue type.
     * @param {number} row The row index of the clue.
     * @param {number} col The column index of the clue.
     */
    renderClue(clueType, row, col) {
        const { cols, state } = this.getClueInfo(clueType);
        const idNum = getCellId(cols, row, col);

        let prefix = "";
        if (clueType === ClueTypeEnum.TOP) {
            prefix = "top";
        } else if (clueType === ClueTypeEnum.LEFT) {
            prefix = "left";
        }
        const elemId = `${prefix}-clue-overlay-${idNum}`;
        const elem = this.elemsDict[elemId];

        if (elem !== null && elem !== undefined) {
            const currStatus = state[row][col];
            if (currStatus === ClueStatusEnum.FINISHED) {
                elem.classList.add(CLASSNAME_CLUE_SLASH);
            } else {
                elem.classList.remove(CLASSNAME_CLUE_SLASH);
            }
        }
    }

    /**
     * Toggle the clue in the top panel.
     * @param {number} rowIdx The row index of the clue.
     * @param {column} colIdx The column index of the clue.
     */
    toggleTopClue(rowIdx, colIdx) {
        try {
            const { state } = this.getClueInfo(ClueTypeEnum.TOP);
            const currStatus = state[rowIdx][colIdx];
            const newStatus = getToggledStatus(currStatus);
            if (currStatus !== newStatus) {
                this.setClueStatus(ClueTypeEnum.TOP, rowIdx, colIdx, newStatus);
            }
        } catch (e) {
            console.error("Failed to toggle clue in the top panel,", e);
        }
    }

    /**
     * Toggle the clue in the left panel.
     * @param {number} rowIdx The row index of the clue.
     * @param {column} colIdx The column index of the clue.
     */
    toggleLeftClue(rowIdx, colIdx) {
        try {
            const { state } = this.getClueInfo(ClueTypeEnum.LEFT);
            const currStatus = state[rowIdx][colIdx];
            const newStatus = getToggledStatus(currStatus);
            if (currStatus !== newStatus) {
                this.setClueStatus(ClueTypeEnum.LEFT, rowIdx, colIdx, newStatus);
            }
        } catch (e) {
            console.error("Failed to toggle clue in the top panel,", e);
        }
    }

    /**
     * Get the clue information based on the clue type.
     * 
     * - rows: The number of rows of the clue panel.
     * - cols: The number of columns of the clue panel.
     * - data: The clue data.
     * - state: The clue state.
     * 
     * @param {ClueTypeEnum} clueType The clue type.
     * @throws An error if something went wrong.
     * @returns {{rows: number, cols: number, data: number[][], state: ClueStatusEnum[][]}}
     */
    getClueInfo(clueType) {
        if (!this.puzzle) {
            throw new ReferenceError("Puzzle does not exist.");
        }

        switch (clueType) {
            case ClueTypeEnum.TOP:
                if (!this.puzzle.topClueData) {
                    throw new ReferenceError("Top clue data does not exist.")
                }

                if (!this.puzzle.topClueState) {
                    throw new ReferenceError("Top clue state does not exist.")
                }

                return {
                    rows: this.puzzle.topClueRows,
                    cols: this.puzzle.topClueCols,
                    data: this.puzzle.topClueData,
                    state: this.puzzle.topClueState,
                };

            case ClueTypeEnum.LEFT:
                if (!this.puzzle.leftClueData) {
                    throw new ReferenceError("Left clue data does not exist.")
                }

                if (!this.puzzle.leftClueState) {
                    throw new ReferenceError("Left clue state does not exist.")
                }

                return {
                    rows: this.puzzle.leftClueRows,
                    cols: this.puzzle.leftClueCols,
                    data: this.puzzle.leftClueData,
                    state: this.puzzle.leftClueState,
                };

            default:
                throw new Error("Clue type is invalid:", clueType);
        }
    }
}


/**
 * Toggles a clue status and returns the new toggled status.
 * @param {ClueStatusEnum} oldStatus The old status.
 * @returns {ClueStatusEnum} The new status.
 */
const getToggledStatus = (oldStatus) => {
    switch (oldStatus) {
        case ClueStatusEnum.BLANK:
            return ClueStatusEnum.BLANK;
        case ClueStatusEnum.FINISHED:
            return ClueStatusEnum.UNFINISHED;
        case ClueStatusEnum.UNFINISHED:
            return ClueStatusEnum.FINISHED;
        default:
            console.error("Failed to get toggled status, invalid clue status:", oldStatus);
            return oldStatus;
    }
}