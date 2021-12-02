import React from "react";

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
                const num = data[row][col] === null ? " " : data[row][col];
                rowCells.push(
                    <td key={rows * col + row} className="cell bordered clue-cell"
                        width={cellSize} height={cellSize}>
                        <b>{num}</b>
                    </td>
                );
            }
            tableRows.push(<tr key={row}>{rowCells}</tr>)
        }

        return <table id="left-table"><tbody>{tableRows}</tbody></table>;
    }
}

export default LeftPanel;
