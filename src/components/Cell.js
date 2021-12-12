import React from "react";
import Colors from "../common/colors";

function Cell(props) {
    const {
        id, rows, cols, row, col, cellSize,
        handleMouseDown, handleMouseEnter
    } = props;

    const cellId = `cell-${id}`;
    const contentId = `cellcontent-${id}`;
    const tdStyle = {
        width: cellSize,
        height: cellSize,
        borderColor: Colors.CELL_BORDER,
        borderStyle: "solid",
        borderWidth: getBorderWidth(rows, cols, row, col)
    };

    const contentSize = cellSize - 4;
    const contentStyle = {
        left: 2,
        width: contentSize,
        height: contentSize
    }

    const overlayClassName = `cell overlay row-${row} col-${col}`;
    const overlayStyle = {
        width: cellSize,
        height: cellSize,
    }

    const coordDisplay = getCoordDisplay(rows, cols, row, col);

    return (
        <td
            key={row * cols + col}
            id={cellId}
            style={tdStyle}
            className="cell grid-cell noselect"
            onMouseDown={(e) => handleMouseDown(e, row, col)}
            onMouseEnter={() => handleMouseEnter(row, col)}
        >

            <div id={contentId} className="cell-content" style={contentStyle} />
            <div className={overlayClassName} style={overlayStyle} />
            {coordDisplay}
        </td>
    );
}

const getBorderWidth = (rows, cols, row, col) => {
    let topBdr = 1;
    let rightBdr = 1;
    let botBdr = 1;
    let leftBdr = 1;

    if (row === 0) {
        topBdr = 2;
    }

    if (col === cols - 1) {
        rightBdr = 2;
    }

    if (col === 0) {
        leftBdr = 2;
    }

    if ((row + 1) % 5 === 0) {
        botBdr = 2;
    }

    if ((col + 1) % 5 === 0) {
        rightBdr = 2;
    }

    if (row === rows - 1) {
        botBdr = 2;
    }

    return `${topBdr}px ${rightBdr}px ${botBdr}px ${leftBdr}px`;
}

const getCoordDisplay = (rows, cols, row, col) => {
    // Only the right-most and bottom-most cells can have a coord display.
    if (row !== rows - 1 && col !== cols - 1) {
        return null;
    }

    // The bottom-right corner cell does not have a coord display.
    if (row === rows - 1 && col === cols - 1) {
        return null;
    }

    if (row === rows - 1 && ((col + 1) % 5 === 0)) {
        return <div className="coord-disp">{col + 1}</div>
    }

    if (col === cols - 1 && ((row + 1) % 5 === 0)) {
        return <div className="coord-disp">{row + 1}</div>
    }
}

export default Cell;
