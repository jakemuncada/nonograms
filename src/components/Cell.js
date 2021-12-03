import React from "react";
import { SYMBOL_ID_EMPTY, SYMBOL_ID_FILL } from "../constants";
import { getCellHeight, getCellWidth } from "../utils";

class Cell extends React.Component {

    shouldComponentUpdate(nextProps) {
        const { cellSize, symbolId, isHighlighted } = this.props;
        return symbolId !== nextProps.symbolId
            || cellSize !== nextProps.cellSize
            || isHighlighted !== nextProps.isHighlighted;
    }

    render() {
        const { rows, cols, row, col, cellSize, symbolId,
            isHighlighted, drawingSymbolId,
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
            backgroundColor: getContentBgColor(symbolId, isHighlighted, drawingSymbolId),
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

const getContentBgColor = (ownSymbolId, isHighlighted, drawingSymbolId) => {
    // If the cell is not highlighted.
    if (!isHighlighted) {
        return getSymbolBgColor(ownSymbolId, false);
    }

    // If the cell is currently EMPTY.
    if (ownSymbolId === SYMBOL_ID_EMPTY) {
        return getSymbolBgColor(drawingSymbolId, isHighlighted);
    }

    // If the cell has a symbol but is in the process of being erased.
    if (ownSymbolId !== SYMBOL_ID_EMPTY && drawingSymbolId === SYMBOL_ID_EMPTY) {
        return getSymbolBgColor(ownSymbolId, isHighlighted);
    }

    // Else, if the cell has a symbol and is in the process of changing symbols.
    return getSymbolBgColor(drawingSymbolId, isHighlighted);
}

const getSymbolBgColor = (symbolId, isHighlighted) => {
    if (!isHighlighted) {
        switch (symbolId) {
            case SYMBOL_ID_EMPTY: return "transparent";
            case SYMBOL_ID_FILL: return "black";
            default: return "red";  // Invalid case
        }
    }
    else {
        switch (symbolId) {
            case SYMBOL_ID_EMPTY: return "transparent";
            case SYMBOL_ID_FILL: return "#4e4e4e";
            default: return "red";  // Invalid case
        }
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
