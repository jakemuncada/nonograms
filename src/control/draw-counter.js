import {
    CLASSNAME_TRANSITION,
    CLASSNAME_VISIBLE,
    ELEM_ID_DRAW_TOOLTIP,
    RULER_TOOLTIP_HALF_HEIGHT,
    RULER_TOOLTIP_HALF_WIDTH,
    RULER_TOOLTIP_HEIGHT,
    SYMBOL_ID_EMPTY
} from "../constants";

class DrawCounter {

    /** 
     * The number of rows of the board.
     * @type {number}
     */
    rows = 0;

    /** 
     * The number of columns of the board.
     * @type {number}
     */
    cols = 0;

    /** 
     * The size of the cells of the board.
     * @type {number}
     */
    cellSize = 0;

    /** 
     * The DOM element of the tooltip.
     * @type {object}
     */
    mainElem = null;

    /** 
     * The DOM element of the tooltip's text.
     * @type {object}
     */
    textElem = null;

    constructor(rows, cols, cellSize) {
        this.rows = rows;
        this.cols = cols;
        this.cellSize = cellSize;
    }

    /**
     * Initialize the DOM elements.
     */
    initialize() {
        this.mainElem = document.getElementById(ELEM_ID_DRAW_TOOLTIP);
        this.textElem = document.getElementById(ELEM_ID_DRAW_TOOLTIP + "-text");
    }

    /**
     * Set the board size.
     * 
     * @param {number} rows The number of rows on the board.
     * @param {number} cols The number of columns on the board.
     * @param {number} cellSize The size of the cells in pixels.
     */
    setSize(rows, cols, cellSize) {
        this.rows = rows;
        this.cols = cols;
        this.cellSize = cellSize;
    }

    /**
     * Hides the tooltip.
     */
    hide() {
        if (this.mainElem) {
            this.mainElem.classList.remove(CLASSNAME_TRANSITION);
            this.mainElem.classList.remove(CLASSNAME_VISIBLE);
        }
    }

    /**
     * Updates and displays the draw counter's visibility and position.
     * 
     * @param {!number} sRow The row of the cell from where the drawn line starts.
     * @param {!number} sCol The column of the cell from where the drawn line starts.
     * @param {!number} eRow The row of the cell where the drawn line ends.
     * @param {!number} eCol The column of the cell where the drawn line ends.
     * @param {!Array<Array<number>>} board The 2-dimensional array containing the symbol IDs of each cell.
     * @param {number} drawSymbol The ID of the symbol currently being drawn.
     * @param {object} sCell The starting cell's DOM object.
     * @param {object} eCell The ending cell's DOM object.
     */
    update(sRow, sCol, eRow, eCol, board, drawSymbol, sCell, eCell) {
        if (this.mainElem === null || this.textElem === null) {
            // If the elements are null, try to initialize it.
            this.initialize();
            // Then, if it still comes up null, the DOM hasn't loaded yet, which means something went wrong.
            if (this.mainElem === null || this.textElem === null) {
                console.error("Failed to update draw counter, elements have not been initialized.");
                return;
            }
        }

        // If the start cell is equal to the end cell, do not display the draw counter.
        if (sRow === eRow && sCol === eCol) {
            this.hide();
            return;
        }

        // Update the position.
        const [posX, posY] = this.getPosition(sRow, sCol, eRow, eCol, sCell, eCell);
        const transform = `translate(${posX}px, ${posY}px)`;
        this.mainElem.style.transform = transform;

        // Update the text.
        const text = this.getText(sRow, sCol, eRow, eCol, board, drawSymbol);
        this.setText(text);

        // Update the width.
        this.updateWidth(text);

        // If the tooltip is not yet visible, remove its transition animation
        // so that it will initially be displayed at the correct position.
        if (!this.mainElem.classList.contains(CLASSNAME_VISIBLE)) {
            this.mainElem.classList.remove(CLASSNAME_TRANSITION);
            this.mainElem.classList.add(CLASSNAME_VISIBLE);         
        }
        // If the tooltip is already visible, add its transition animation
        // so that it will smoothly animate to the correct position.
        else {
            this.mainElem.classList.add(CLASSNAME_TRANSITION);
        }
    }

    /**
     * Gets the x and y coordinates of the tooltip based on the drawn line.
     * 
     * @param {number} sRow The row of the cell from where the drawn line starts.
     * @param {number} sCol The column of the cell from where the drawn line starts.
     * @param {number} eRow The row of the cell where the drawn line ends.
     * @param {number} eCol The column of the cell where the drawn line ends.
     * @param {object} sCell The starting cell's DOM object.
     * @param {object} eCell The ending cell's DOM object.
     * 
     * @returns {Array<number>} The array containing the x and y coordinates of the tooltip.
     */
    getPosition(sRow, sCol, eRow, eCol, sCell, eCell) {
        if (sCell === null || sCell === undefined) {
            console.error("Cannot get draw counter position, cell1 not found.");
            return;
        }
        if (eCell === null || eCell === undefined) {
            console.error("Cannot get draw counter position, cell2 not found.");
            return;
        }

        let posX, posY, margin;
        const [midX, midY] = this.getMidpoint(sCell, eCell);

        // Horizontal draw.
        if (sRow === eRow) {
            posX = midX;
            const rowsAbove = sRow;
            const rowsBelow = this.rows - (sRow + 1);
            margin = RULER_TOOLTIP_HALF_HEIGHT + (this.cellSize / 2) + 4;

            // If there is more space above the drawn row, position the tooltip above.
            if (rowsAbove >= rowsBelow) {
                posY = midY - margin;
            } else {
                posY = midY + margin;
            }
        }
        // Vertical draw.
        else if (sCol === eCol) {
            posY = midY;
            const colsLeft = sCol;
            const colsRight = this.cols - (sCol + 1);
            margin = RULER_TOOLTIP_HALF_WIDTH + (this.cellSize / 2) + 4;

            // If there is more space above the drawn row, position the tooltip above.
            if (colsLeft >= colsRight) {
                posX = midX - margin;
            } else {
                posX = midX + margin;
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
     * Gets the x and y coordinates of the midpoint between the two elements.
     * 
     * @param {object} elem1 The first DOM element.
     * @param {object} elem2 The second DOM element.
     * 
     * @returns {Array<number>} An array containing the x and y coordinates
     *      of the midpoint between the two elements.
     */
    getMidpoint(elem1, elem2) {
        if (elem1 === null || elem1 === undefined) {
            console.error("Cannot get midpoint, elem1 not found.");
            return;
        }
        if (elem2 === null || elem2 === undefined) {
            console.error("Cannot get midpoint, elem2 not found.");
            return;
        }

        const rect1 = elem1.getBoundingClientRect();
        const rect2 = elem2.getBoundingClientRect();

        const minX = Math.min(rect1.left, rect2.left);
        const maxX = Math.max(rect1.right, rect2.right);
        const minY = Math.min(rect1.top, rect2.top);
        const maxY = Math.max(rect1.bottom, rect2.bottom);

        const midX = ((maxX - minX) / 2) + minX;
        const midY = ((maxY - minY) / 2) + minY;

        return [midX, midY];
    }

    updateWidth(text) {
        let width = RULER_TOOLTIP_HEIGHT;
        if (text.length > 4) {
            width = width + 10;
        } else if (text.length === 4) {
            width = width + 5;
        }
        this.setTooltipWidth(width);
    }

    setTooltipWidth(width) {
        if (this.mainElem) {
            this.mainElem.style.width = `${width}px`;
        }
    }

    /**
     * Sets the draw counter text.
     * 
     * @param {string} text The new tooltip text.
     */
    setText(text) {
        if (this.textElem) {
            this.textElem.innerHTML = text;
        }
    }

    /**
     * Gets the tooltip text based on the drawn line.
     * 
     * @param {number} sRow The row of the cell from where the drawn line starts.
     * @param {number} sCol The column of the cell from where the drawn line starts.
     * @param {number} eRow The row of the cell where the drawn line ends.
     * @param {number} eCol The column of the cell where the drawn line ends.
     * @param {Array<Array<number>>} board The 2-dimensional array containing the symbol IDs of each cell.
     * @param {number} drawSymbol The ID of the symbol currently being drawn.
     * 
     * @returns {string} The tooltip text.
     */
    getText(sRow, sCol, eRow, eCol, board, drawSymbol) {
        let row, col, actualCount, totalCount;

        // Horizontal draw.
        if (sRow === eRow) {
            row = sRow;
            actualCount = Math.abs(eCol - sCol) + 1;
            totalCount = actualCount;

            if (drawSymbol === SYMBOL_ID_EMPTY) {
                return actualCount;
            }

            col = Math.min(eCol, sCol) - 1;
            while (col >= 0 && board[row][col] === drawSymbol) {
                totalCount += 1;
                col -= 1;
            }

            col = Math.max(eCol, sCol) + 1;
            while (col < this.cols && board[row][col] === drawSymbol) {
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

            if (drawSymbol === SYMBOL_ID_EMPTY) {
                return actualCount;
            }

            row = Math.min(eRow, sRow) - 1;
            while (row >= 0 && board[row][col] === drawSymbol) {
                totalCount += 1;
                row -= 1;
            }

            row = Math.max(eRow, sRow) + 1;
            while (row < this.cols && board[row][col] === drawSymbol) {
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

export default DrawCounter;