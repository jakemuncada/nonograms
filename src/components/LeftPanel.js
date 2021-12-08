import React from "react";
import { COLOR_CELL_BORDER } from "../constants";
import { getClueFontSize } from "../utils";

function LeftPanel(props) {
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

    let tableRows = [];
    for (let row = 0; row < rows; row++) {
        let rowCells = [];

        for (let col = 0; col < cols; col++) {

            let tdStyle = {
                width: cellSize,
                height: cellSize,
                borderColor: COLOR_CELL_BORDER,
                borderStyle: "solid",
                borderWidth: getBorderWidth(rows, cols, row, col),
                fontSize: `${getClueFontSize(cellSize)}pt`,
            }

            let overlayStyle = {
                width: cellSize,
                height: cellSize,
            }

            let overlayClassName = `cell-overlay row-${row}`;

            const num = data[row][col] === null ? " " : data[row][col];

            rowCells.push(
                <td key={rows * col + row} className="cell clue-cell" style={tdStyle}>
                    <b>{num}</b>
                    <div className={overlayClassName} style={overlayStyle} />
                </td>
            );
        }
        tableRows.push(<tr key={row}>{rowCells}</tr>)
    }

    return <table id="left-table"><tbody>{tableRows}</tbody></table>;
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
        rightBdr = 0;
    }

    if (col === 0) {
        leftBdr = 2;
    }

    if ((row + 1) % 5 === 0) {
        botBdr = 2;
    }

    if (row === rows - 1) {
        botBdr = 2;
    }

    return `${topBdr}px ${rightBdr}px ${botBdr}px ${leftBdr}px`;
}

export default LeftPanel;
