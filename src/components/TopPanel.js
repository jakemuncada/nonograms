import React from "react";

class TopPanel extends React.Component {
    getMaxNumOfRows(data) {
        let ret = 0;
        for (let col = 0; col < data.length; col++) {
            ret = Math.max(ret, data[col].length);
        }
        return ret;
    }

    processData(data, rows, cols) {
        let cellData = [];

        for (let col = 0; col < cols; col++) {
            let colArr = [];
            for (let row = 0; row < rows; row++) {
                colArr.push(0);
            }
            cellData.push(colArr);
        }

        for (let col = 0; col < data.length; col++) {
            for (let row = 0; row < data[col].length; row++) {
                cellData[col][row] = data[col][row];
            }
        }

        return cellData;
    }

    render() {
        let { data, cellWidth } = this.props;
        if (data === null || data.length <= 0) {
            return null;
        }

        let cells = [];
        const rows = this.getMaxNumOfRows(data);
        data = this.processData(data, rows, data.length);

        for (let col = 0; col < data.length; col++) {
            for (let row = 0; row < data[col].length; row++) {
                const num = data[col][row] === 0 ? " " : data[col][row];
                const myRow = rows - row;
                const style = { gridRow: myRow, gridColumn: col + 1, width: cellWidth };
                cells.push(
                    <div key={rows * col + row} className="cell bordered clue-cell" style={style}>
                        <b>{num}</b>
                    </div>
                );
            }
        }

        return <div className="grid">{cells}</div>;
    }
}

export default TopPanel;
