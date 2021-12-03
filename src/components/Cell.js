import React from "react";
import SymbolSquare from "./symbols/SymbolSquare";
import SymbolX from "./symbols/SymbolX";
import { COLOR_CELL_BORDER, COLOR_CROSSHAIR_OVERLAY, COLOR_SYMBOL_HIGHLIGHT,
    COLOR_SYMBOL_NORMAL, SYMBOL_ID_EMPTY, SYMBOL_ID_FILL, SYMBOL_ID_X } from "../constants";

class Cell extends React.Component {

    shouldComponentUpdate(nextProps) {
        const { cellSize, symbolId, isHighlighted, isCrosshair } = this.props;
        return symbolId !== nextProps.symbolId
            || cellSize !== nextProps.cellSize
            || isHighlighted !== nextProps.isHighlighted
            || isCrosshair !== nextProps.isCrosshair;
    }

    render() {
        const {
            rows, cols, row, col,cellSize, symbolId,
            isHighlighted, isCrosshair, drawingSymbolId,
            handleMouseDown, handleMouseEnter
        } = this.props;

        const tdStyle = {
            width: cellSize,
            height: cellSize,
            borderColor: COLOR_CELL_BORDER,
            borderStyle: "solid",
            borderWidth: getBorderWidth(rows, cols, row, col)
        };

        const contentSize = cellSize - 4;
        const contentStyle = {
            left: 2,
            width: contentSize,
            height: contentSize
        }

        const overlayStyle = {
            width: cellSize,
            height: cellSize,
            backgroundColor: isCrosshair ? COLOR_CROSSHAIR_OVERLAY : "transparent"
        }

        const symbol = getSymbol(symbolId, isHighlighted, drawingSymbolId, contentSize);

        const coordDisplay = getCoordDisplay(rows, cols, row, col);

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
                <div className="cell-overlay" style={overlayStyle} />
                {coordDisplay}
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
                return <SymbolSquare size={contentSize} color={COLOR_SYMBOL_NORMAL} />
            case SYMBOL_ID_X:
                return <SymbolX size={contentSize} color={COLOR_SYMBOL_NORMAL} />
            default: 
                return null;  // Invalid case
        }
    }
    else {
        switch (symbolId) {
            case SYMBOL_ID_EMPTY:
                return null;
            case SYMBOL_ID_FILL:
                return <SymbolSquare size={contentSize} color={COLOR_SYMBOL_HIGHLIGHT} />
                case SYMBOL_ID_X:
                    return <SymbolX size={contentSize} color={COLOR_SYMBOL_HIGHLIGHT} />
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

const getCoordDisplay = (rows, cols, row, col) => {
    // Only the right-most and bottom-most cells can have a coord display.
    if (row !== rows - 1 && col !== cols - 1) {
        return null;
    }

    // The bottom-right corner cell does not have a coord display.
    if (row === rows - 1 && col === cols - 1) {
        return null;
    }

    if (row === rows - 1 && ((col + 1) % 5 === 0)) {
        return <div className="coord-disp">{col + 1}</div>
    }

    if (col === cols - 1 && ((row + 1) % 5 === 0)) {
        return <div className="coord-disp">{row + 1}</div>
    }
}

export default Cell;
