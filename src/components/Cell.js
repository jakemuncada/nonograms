import React from "react";
import { SYMBOL_ID_FILL } from "../constants";
import { getCellHeight, getCellWidth } from "../utils";

class Cell extends React.Component {

    shouldComponentUpdate(nextProps) {
        const { width, height, symbolId } = this.props;
        return symbolId !== nextProps.symbolId
            || width !== nextProps.width
            || height !== nextProps.height;
    }

    render() {
        const { rows, cols, row, col, cellSize, symbolId,
            handleMouseDown, handleMouseEnter } = this.props;

        const tdStyle = {
            width: getCellWidth(cols, col, cellSize),
            height: getCellHeight(row, cellSize),
            borderColor: "black",
            borderStyle: "solid",
            borderWidth: getBorderWidth(rows, cols, row, col)
        };

        const contentStyle = {
            left: 2,
            width: cellSize - 5,
            height: cellSize - 5,
            backgroundColor: (symbolId === SYMBOL_ID_FILL) ? "black" : "transparent",
        }

        return (
            <td
                key={row * cols + col}
                style={tdStyle}
                className="cell grid-cell nodrag"
                onMouseDown={(e) => handleMouseDown(e, row, col)}
                onMouseEnter={() => handleMouseEnter(row, col)}
            >
                <div className="cell-content" style={contentStyle}></div>
            </td>
        );
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

    if ((row + 1) % 5 === 0) {
        botBdr = 2;
    }

    if ((col + 1) % 5 === 0) {
        rightBdr = 2;
    }

    if (row === rows - 1) {
        botBdr = 2;
    }

    return `${topBdr}px ${rightBdr}px ${botBdr}px ${leftBdr}px`;
}

export default Cell;
