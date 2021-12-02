import React from "react";

class TopPanel extends React.Component {

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

        return <table id="top-table"><tbody>{tableRows}</tbody></table>;
    }
}

export default TopPanel;
