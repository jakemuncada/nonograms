import React from "react";
import { getCellHeight } from "../utils";

class LeftPanel extends React.Component {
    getMaxNumOfCols(data) {
        let ret = 0;
        for (let row = 0; row < data.length; row++) {
            ret = Math.max(ret, data[row].length);
        }
        return ret;
    }

    processData(data, rows, cols) {
        let cellData = [];

        for (let row = 0; row < rows; row++) {
            let arr = [];
            for (let col = 0; col < cols; col++) {
                arr.push(0);
            }
            cellData.push(arr);
        }

        for (let row = 0; row < data.length; row++) {
            for (let col = 0; col < data[row].length; col++) {
                cellData[row][col] = data[row][col];
            }
        }

        return cellData;
    }

    render() {
        let { rows, cols, data, cellSize } = this.props;

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
                    width: getWidth(cols, col, cellSize),
                    height: getCellHeight(row, cellSize),
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

        return <table id="left-table"><tbody>{tableRows}</tbody></table>;
    }
}

const getWidth = (cols, col, cellSize) => (
    (col === cols - 1) ? cellSize - 1 : cellSize
);

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
