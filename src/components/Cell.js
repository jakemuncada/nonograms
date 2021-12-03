import React from "react";
import { SYMBOL_ID_EMPTY, SYMBOL_ID_FILL, SYMBOL_ID_X } from "../constants";
import SymbolSquare from "./symbols/SymbolSquare";
import SymbolX from "./symbols/SymbolX";

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
            width: cellSize,
            height: cellSize,
            borderColor: "black",
            borderStyle: "solid",
            borderWidth: getBorderWidth(rows, cols, row, col)
        };

        const contentSize = cellSize - 4;
        const contentStyle = {
            left: 2,
            width: contentSize,
            height: contentSize
        }

        const symbol = getSymbol(symbolId, isHighlighted, drawingSymbolId, contentSize);

        return (
            <td
                key={row * cols + col}
                style={tdStyle}
                className="cell grid-cell nodrag"
                onMouseDown={(e) => handleMouseDown(e, row, col)}
                onMouseEnter={() => handleMouseEnter(row, col)}
            >
                <div className="cell-content" style={contentStyle}>
                    {symbol}
                </div>
            </td>
        );
    }
}

const getSymbol = (ownSymbolId, isHighlighted, drawingSymbolId, contentSize) => {
    // If the cell is not highlighted.
    if (!isHighlighted) {
        return _getSymbol(ownSymbolId, false, contentSize);
    }

    // If the cell is currently EMPTY.
    if (ownSymbolId === SYMBOL_ID_EMPTY) {
        return _getSymbol(drawingSymbolId, isHighlighted, contentSize);
    }

    // If the cell has a symbol but is in the process of being erased.
    if (ownSymbolId !== SYMBOL_ID_EMPTY && drawingSymbolId === SYMBOL_ID_EMPTY) {
        return _getSymbol(ownSymbolId, isHighlighted, contentSize);
    }

    // Else, if the cell has a symbol and is in the process of changing symbols.
    return _getSymbol(drawingSymbolId, isHighlighted, contentSize);
}

const _getSymbol = (symbolId, isHighlighted, contentSize) => {
    if (!isHighlighted) {
        switch (symbolId) {
            case SYMBOL_ID_EMPTY:
                return null;
            case SYMBOL_ID_FILL:
                return <SymbolSquare size={contentSize} color="black" />
            case SYMBOL_ID_X:
                return <SymbolX size={contentSize} color="black" />
            default: 
                return null;  // Invalid case
        }
    }
    else {
        const color="#454545"
        switch (symbolId) {
            case SYMBOL_ID_EMPTY:
                return null;
            case SYMBOL_ID_FILL:
                return <SymbolSquare size={contentSize} color={color} />
                case SYMBOL_ID_X:
                    return <SymbolX size={contentSize} color={color} />
            default: 
                return null;  // Invalid case
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
