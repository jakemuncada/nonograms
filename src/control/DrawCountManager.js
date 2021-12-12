import { DrawingSymbolEnum } from "../common/enums";
import {
    CLASSNAME_TRANSITION,
    CLASSNAME_VISIBLE,
    RULER_TOOLTIP_HALF_HEIGHT,
    RULER_TOOLTIP_HALF_WIDTH,
    RULER_TOOLTIP_HEIGHT,
} from "../common/constants";


/** Class responsible for displaying the drawing count tooltip. */
class DrawCountManager {

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
     * Constructor.
     * @param {Puzzle} puzzle The puzzle object.
     * @param {ElementManager} elemMgr The ElementManager.
     */
    constructor(puzzle, elemMgr) {
        this.puzzle = puzzle;
        this.elemMgr = elemMgr;
    }

    /**
     * Hides the tooltip.
     */
    hide() {
        if (this.elemMgr.drawCountTooltipMain) {
            this.elemMgr.drawCountTooltipMain.classList.remove(CLASSNAME_TRANSITION);
            this.elemMgr.drawCountTooltipMain.classList.remove(CLASSNAME_VISIBLE);
        }
    }

    /**
     * Updates and displays the draw counter's visibility and position.
     * @param {!number} sRow The row of the cell from where the drawn line starts.
     * @param {!number} sCol The column of the cell from where the drawn line starts.
     * @param {!number} eRow The row of the cell where the drawn line ends.
     * @param {!number} eCol The column of the cell where the drawn line ends.
     * @param {!Array<Array<number>>} board The 2-dimensional array containing the symbol IDs of each cell.
     * @param {number} drawSymbol The ID of the symbol currently being drawn.
     * @param {HTMLElement} sCell The starting cell's DOM object.
     * @param {HTMLElement} eCell The ending cell's DOM object.
     */
    update(sRow, sCol, eRow, eCol, board, drawSymbol, sCell, eCell) {
        if (this.elemMgr.drawCountTooltipMain === null ||
            this.elemMgr.drawCountTooltipText === null) {
            console.error("Failed to update draw counter, elements have not been initialized.");
            return;
        }

        // If the start cell is equal to the end cell, do not display the draw counter.
        if (sRow === eRow && sCol === eCol) {
            this.hide();
            return;
        }

        try {
            // Update the position.
            const [posX, posY] = this.getPosition(sRow, sCol, eRow, eCol, sCell, eCell);
            const transform = `translate(${posX}px, ${posY}px)`;
            this.elemMgr.drawCountTooltipMain.style.transform = transform;

            // Update the text.
            const text = this.getText(sRow, sCol, eRow, eCol, board, drawSymbol);
            this.setText(text);

            // Update the width.
            this.updateWidth(text);

            // If the tooltip is not yet visible, remove its transition animation
            // so that it will initially be displayed at the correct position.
            if (!this.elemMgr.drawCountTooltipMain.classList.contains(CLASSNAME_VISIBLE)) {
                this.elemMgr.drawCountTooltipMain.classList.remove(CLASSNAME_TRANSITION);
                this.elemMgr.drawCountTooltipMain.classList.add(CLASSNAME_VISIBLE);
            }
            // If the tooltip is already visible, add its transition animation
            // so that it will smoothly animate to the correct position.
            else {
                this.elemMgr.drawCountTooltipMain.classList.add(CLASSNAME_TRANSITION);
            }
        } catch (e) {
            console.error("Failed to render the DrawCount tooltip,", e);
        }
    }

    /**
     * Gets the screen coordinates of the tooltip based on the drawn line.
     * @param {number} sRow The row of the cell from where the drawn line starts.
     * @param {number} sCol The column of the cell from where the drawn line starts.
     * @param {number} eRow The row of the cell where the drawn line ends.
     * @param {number} eCol The column of the cell where the drawn line ends.
     * @param {object} sCell The starting cell's DOM object.
     * @param {object} eCell The ending cell's DOM object.
     * @returns {Array<number>} The array containing the x and y coordinates of the tooltip.
     */
    getPosition(sRow, sCol, eRow, eCol, sCell, eCell) {
        if (sCell === null || sCell === undefined) {
            throw new ReferenceError("Start cell not found.");
        }
        if (eCell === null || eCell === undefined) {
            throw new ReferenceError("End cell not found.");
        }

        let posX, posY, margin;
        const rect1 = sCell.getBoundingClientRect();
        const rect2 = eCell.getBoundingClientRect();
        const [midX, midY] = this.getMidpoint(rect1, rect2);

        // Horizontal draw.
        if (sRow === eRow) {
            posX = midX;
            const rowsAbove = sRow;
            const rowsBelow = this.puzzle.rows - (sRow + 1);
            margin = RULER_TOOLTIP_HALF_HEIGHT + 4;

            // If there is more space above the drawn row, position the tooltip above.
            // Else, if there is more space below the drawn row, position the tooltip below.
            if (rowsAbove >= rowsBelow) {
                posY = rect1.top - margin;
            } else {
                posY = rect1.bottom + margin;
            }
        }
        // Vertical draw.
        else if (sCol === eCol) {
            posY = midY;
            const colsLeft = sCol;
            const colsRight = this.puzzle.cols - (sCol + 1);
            margin = RULER_TOOLTIP_HALF_WIDTH + 4;

            // If there is more space to the left of the drawn row, position the tooltip to the left.
            // Else, if there is more space to the right of the drawn row, position the tooltip to the right.
            if (colsLeft >= colsRight) {
                posX = rect1.left - margin;
            } else {
                posX = rect1.right + margin;
            }
        }
        // Invalid case: Diagonal draw.
        else {
            console.error("Failed to get position, diagonal draw is invalid.",
                sRow, sCol, eRow, eCol);
        }

        return [posX, posY];
    }

    /**
     * Gets the x and y coordinates of the midpoint between the two elements' bounding rects.
     * @param {object} rect1 The first DOM element's bounding rect.
     * @param {object} rect2 The second DOM element's bounding rect.
     * @returns {Array<number>} An array containing the x and y coordinates
     *      of the midpoint between the two elements.
     */
    getMidpoint(rect1, rect2) {
        if (rect1 === null || rect1 === undefined) {
            console.error("Cannot get midpoint, rect1 not found.");
            return;
        }
        if (rect2 === null || rect2 === undefined) {
            console.error("Cannot get midpoint, rect2 not found.");
            return;
        }

        const minX = Math.min(rect1.left, rect2.left);
        const maxX = Math.max(rect1.right, rect2.right);
        const minY = Math.min(rect1.top, rect2.top);
        const maxY = Math.max(rect1.bottom, rect2.bottom);

        const midX = ((maxX - minX) / 2) + minX;
        const midY = ((maxY - minY) / 2) + minY;

        return [midX, midY];
    }

    /**
     * Updates the width of the tooltip depending on its text.
     * 
     * @param {string} text The tooltip text.
     */
    updateWidth(text) {
        let width = RULER_TOOLTIP_HEIGHT;
        if (text.length > 4) {
            width = width + 10;
        } else if (text.length === 4) {
            width = width + 5;
        }
        this.setTooltipWidth(width);
    }

    /**
     * Sets the tooltip width.
     * @param {number} width The new width of the tooltip.
     */
    setTooltipWidth(width) {
        if (this.elemMgr.drawCountTooltipMain) {
            this.elemMgr.drawCountTooltipMain.style.width = `${width}px`;
        }
    }

    /**
     * Sets the draw counter text.
     * @param {string} text The new tooltip text.
     */
    setText(text) {
        if (this.elemMgr.drawCountTooltipText) {
            this.elemMgr.drawCountTooltipText.innerHTML = text;
        }
    }

    /**
     * Gets the tooltip text based on the drawn line.
     * @param {number} sRow The row of the cell from where the drawn line starts.
     * @param {number} sCol The column of the cell from where the drawn line starts.
     * @param {number} eRow The row of the cell where the drawn line ends.
     * @param {number} eCol The column of the cell where the drawn line ends.
     * @param {Array<Array<number>>} board The 2-dimensional array containing the symbol IDs of each cell.
     * @param {number} drawSymbol The ID of the symbol currently being drawn.
     * @returns {string} The tooltip text.
     */
    getText(sRow, sCol, eRow, eCol, board, drawSymbol) {
        let row, col, actualCount, totalCount;

        // Horizontal draw.
        if (sRow === eRow) {
            row = sRow;
            actualCount = Math.abs(eCol - sCol) + 1;
            totalCount = actualCount;

            if (drawSymbol === DrawingSymbolEnum.EMPTY) {
                return actualCount;
            }

            col = Math.min(eCol, sCol) - 1;
            while (col >= 0 && board[row][col] === drawSymbol) {
                totalCount += 1;
                col -= 1;
            }

            col = Math.max(eCol, sCol) + 1;
            while (col < this.puzzle.cols && board[row][col] === drawSymbol) {
                totalCount += 1;
                col += 1;
            }

            if (actualCount === totalCount) {
                return actualCount;
            }
            else {
                return `${actualCount}/${totalCount}`;
            }
        }
        // Vertical draw.
        else if (sCol === eCol) {
            col = sCol;
            actualCount = Math.abs(eRow - sRow) + 1;
            totalCount = actualCount;

            if (drawSymbol === DrawingSymbolEnum.EMPTY) {
                return actualCount;
            }

            row = Math.min(eRow, sRow) - 1;
            while (row >= 0 && board[row][col] === drawSymbol) {
                totalCount += 1;
                row -= 1;
            }

            row = Math.max(eRow, sRow) + 1;
            while (row < this.puzzle.cols && board[row][col] === drawSymbol) {
                totalCount += 1;
                row += 1;
            }

            if (actualCount === totalCount) {
                return actualCount;
            }
            else {
                return `${actualCount}/${totalCount}`;
            }
        }
        // Invalid case: Diagonal draw.
        else {
            console.error("Failed to get position, diagonal draw is invalid.",
                sRow, sCol, eRow, eCol);
        }
    }
}

export default DrawCountManager;