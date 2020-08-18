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
        let { data, cellHeight } = this.props;
        if (data === null || data.length <= 0) {
            return null;
        }

        let cells = [];
        const cols = this.getMaxNumOfCols(data);
        data = this.processData(data, data.length, cols);

        for (let row = 0; row < data.length; row++) {
            for (let col = 0; col < data[row].length; col++) {
                const num = data[row][col] === 0 ? " " : data[row][col];
                const myCol = cols - col;
                const style = { gridRow: row + 1, gridColumn: myCol, height: cellHeight };
                cells.push(
                    <div key={cols * row + col} className="cell bordered clue-cell" style={style}>
                        <span className="num"><b>{num}</b></span>
                    </div>
                );
            }
        }

        const gridStyle = { gridTemplateColumns: "repeat(" + cols + ", 1fr)" }

        return <div className="grid" style={gridStyle}>{cells}</div>;
    }
}

export default LeftPanel;
