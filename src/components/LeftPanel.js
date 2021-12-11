import React from "react";
import Nonogram from "../control/NonogramManager";
import Colors from "../common/colors";
import { getCellId, getClueFontSize } from "../common/utils";
import { MouseButtonsEnum } from "../common/enums";


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

    const tableRows = [];
    for (let row = 0; row < rows; row++) {
        const rowCells = [];
        for (let col = 0; col < cols; col++) {
            const key = getCellId(cols, row, col);

            const tdStyle = {
                width: cellSize,
                height: cellSize,
                borderColor: Colors.CELL_BORDER,
                borderStyle: "solid",
                borderWidth: getBorderWidth(rows, cols, row, col),
                fontSize: `${getClueFontSize(cellSize)}pt`,
            }

            const overlayId = `left-clue-overlay-${key}`;
            const overlayClassName = `clue overlay row-${row}`;
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

    return <table id="left-table"><tbody>{tableRows}</tbody></table>;
}

const toggleClue = (e, row, col) => {
    if (e.buttons === MouseButtonsEnum.LEFT || e.buttons === MouseButtonsEnum.RIGHT) {
        Nonogram.clueMgr.toggleLeftClue(row, col);
    }
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
