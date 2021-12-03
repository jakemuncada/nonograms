import React from "react";
import { SYMBOL_ID_FILL } from "../constants";

class Cell extends React.Component {

    shouldComponentUpdate(nextProps) {
        const { width, height, symbolId } = this.props;
        return symbolId !== nextProps.symbolId || width !== nextProps.width || height !== nextProps.height;
    }

    render() {
        const { cols, row, col, width, height,
            symbolId, handleMouseDown, handleMouseEnter } = this.props;

        const tdStyle = {
            width: width,
            height: height
        };

        const contentStyle = {
            left: 2,
            width: width - 5,
            height: height - 5,
            backgroundColor: (symbolId === SYMBOL_ID_FILL) ? "black" : "#f0f0f0",
        }

        return (
            <td
                key={row * cols + col}
                style={tdStyle}
                className="cell grid-cell nodrag bordered"
                onMouseDown={(e) => handleMouseDown(e, row, col)}
                onMouseEnter={() => handleMouseEnter(row, col)}
            >
                <div className="cell-content" style={contentStyle}></div>
            </td>
        );
    }
}

export default Cell;
