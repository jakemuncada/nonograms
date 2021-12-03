import React from "react";
import { getClueFontSize } from "../utils";

class TopPanel extends React.Component {

    render() {
        const { rows, cols, data, cellSize } = this.props;

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
                    fontSize: `${getClueFontSize(cellSize)}pt`,
                    borderColor: "black",
                    borderStyle: "solid",
                    borderWidth: getBorderWidth(rows, cols, row, col)
                }

                const num = data[row][col] === null ? " " : data[row][col];

                rowCells.push(
                    <td key={rows * col + row} className="cell clue-cell" style={tdStyle}>
                        <b>{num}</b>
                    </td>
                );
            }
            tableRows.push(<tr key={row}>{rowCells}</tr>)
        }

        return <table id="top-table"><tbody>{tableRows}</tbody></table>;
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

export default TopPanel;
