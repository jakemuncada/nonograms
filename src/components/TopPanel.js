import React from "react";
import Nonogram from "../control/NonogramManager";
import { getCellId, getClueFontSize } from "../utils";
import {
    COLOR_CELL_BORDER,
    MOUSE_PRIMARY_BTN,
    MOUSE_SECONDARY_BTN
} from "../constants";

function TopPanel(props) {
    const { rows, cols, data, cellSize } = props;

    if (data === null || data.length <= 0) {
        return null;
    }

    if (rows === 0 || cols === 0 || data.length === 0) {
        return null;
    }

    if (data.length !== rows || data[0].length !== cols) {
        return null;
    }

    const tableRows = [];
    for (let row = 0; row < rows; row++) {
        const rowCells = [];
        for (let col = 0; col < cols; col++) {
            const key = getCellId(cols, row, col);

            const tdStyle = {
                width: cellSize,
                height: cellSize,
                borderColor: COLOR_CELL_BORDER,
                borderStyle: "solid",
                borderWidth: getBorderWidth(rows, cols, row, col),
                fontSize: `${getClueFontSize(cellSize)}pt`,
            }

            const overlayId = `top-clue-overlay-${key}`;
            const overlayClassName = `clue overlay col-${col}`;
            const overlayStyle = {
                width: cellSize,
                height: cellSize,
            }

            const num = data[row][col] === null ? " " : data[row][col];

            rowCells.push(
                <td
                    key={key}
                    className="cell clue-cell"
                    style={tdStyle}
                    onMouseDown={(e) => toggleClue(e, row, col)}
                    onMouseEnter={(e) => toggleClue(e, row, col)}>
                    <b>{num}</b>
                    <div id={overlayId} className={overlayClassName} style={overlayStyle} />
                </td>
            );
        }
        tableRows.push(<tr key={row}>{rowCells}</tr>)
    }

    return <table id="top-table"><tbody>{tableRows}</tbody></table>;
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

    if ((col + 1) % 5 === 0) {
        rightBdr = 2;
    }

    if (row === rows - 1) {
        botBdr = 0;
    }

    return `${topBdr}px ${rightBdr}px ${botBdr}px ${leftBdr}px`;
}

const toggleClue = (e, row, col) => {
    if (e.buttons === MOUSE_PRIMARY_BTN || e.buttons === MOUSE_SECONDARY_BTN) {
        Nonogram.clueMgr.toggleTopClue(row, col);
    }
}

export default TopPanel;
