import React from "react";
import Cell from "./Cell";

import "./Board.css";

class Grid extends React.Component {
    render() {
        const { rows, cols, cellWidth, cellHeight } = this.props;

        let board = [];
        for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
            for (let colIdx = 0; colIdx < cols; colIdx++) {
                board.push(
                    <Cell
                        key={rowIdx * cols + colIdx}
                        row={rowIdx}
                        col={colIdx}
                        width={cellWidth}
                        height={cellHeight}
                    />
                );
            }
        }

        return (
            <div className="grid bordered">
                {board}
            </div>
        );
    }
}

export default Grid;
