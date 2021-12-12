import React from "react";
import Cell from "./Cell";
import Nonogram from "../control/NonogramManager";
import { getCellId } from "../common/utils";
import { MouseButtonEnum, DrawingSymbolEnum } from "../common/enums";
import "./Board.css";


class Grid extends React.Component {

    handleMouseDownOnCell = (e, cellRow, cellCol) => {
        let drawSymbol = null;

        // If the user presses another mouse button while drawing, cancel the current drawing.
        if (Nonogram.drawMgr.isDrawing) {
            Nonogram.drawMgr.cancel();
        }
        else {
            if (e.button === MouseButtonEnum.LEFT) {
                drawSymbol = Nonogram.drawMgr.selectedSymbol;
            }
            else if (e.button === MouseButtonEnum.RIGHT) {
                drawSymbol = DrawingSymbolEnum.X;
            }

            if (drawSymbol !== null) {
                Nonogram.drawMgr.start(cellRow, cellCol, drawSymbol);
            }
        }

        document.addEventListener("mouseup", this.handleMouseUp);
    }

    handleMouseEnterOnCell = (cellRow, cellCol) => {
        if (Nonogram.drawMgr.isDrawing) {
            Nonogram.drawMgr.move(cellRow, cellCol);
        }
        Nonogram.crosshairMgr.target(cellRow, cellCol);
    }

    handleMouseUp = () => {
        Nonogram.drawMgr.end();
        document.removeEventListener("mouseup", this.handleMouseUp);
    }

    render() {
        const { rows, cols, cellSize } = this.props;

        let tableRows = [];
        for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
            let rowCells = [];
            for (let colIdx = 0; colIdx < cols; colIdx++) {
                const cellId = getCellId(cols, rowIdx, colIdx);
                rowCells.push(
                    <Cell
                        key={cellId}
                        id={cellId}
                        row={rowIdx}
                        col={colIdx}
                        rows={rows}
                        cols={cols}
                        cellSize={cellSize}
                        handleMouseDown={(e, row, col, cellSymbol) => this.handleMouseDownOnCell(e, row, col, cellSymbol)}
                        handleMouseEnter={(row, col) => this.handleMouseEnterOnCell(row, col)}
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
