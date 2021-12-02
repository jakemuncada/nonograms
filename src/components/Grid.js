import React from "react";
import Cell from "./Cell";

import "./Board.css";

class Grid extends React.Component {
    render() {
        const { rows, cols, cellSize } = this.props;

        let tableRows = [];
        for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
            let rowCells = [];
            for (let colIdx = 0; colIdx < cols; colIdx++) {
                rowCells.push(
                    <Cell
                        key={rowIdx * cols + colIdx}
                        row={rowIdx}
                        col={colIdx}
                        width={cellSize}
                        height={cellSize}
                    />
                );
            }
            let trElem = (
                <tr key={rowIdx}>{rowCells}</tr>
            );
            tableRows.push(trElem);
        }

        return (
            <table id="board-table">
                <tbody>
                    {tableRows}
                </tbody>
            </table>
        );
    }
}

export default Grid;
