import React from "react";
import { connect } from "react-redux";

import Cell from "./Cell";
import { boardClone, getCellId, getCellRowCol, getHighlightedCells } from "../utils";
import { setPuzzleData } from "../redux/actions/board";
import { MOUSE_LEFT_BTN, SYMBOL_ID_EMPTY, SYMBOL_ID_FILL } from "../constants";

import "./Board.css";


const mapStateToProps = (state) => {
    return {
        rows: state.board.rows,
        cols: state.board.cols,
        cellSize: state.board.cellSize,
        currSymbolId: state.interaction.currSymbolId,
        boardData: state.board.data
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setBoardData: (boardData) => dispatch(setPuzzleData(boardData))
    };
};


class Grid extends React.Component {

    state = {
        isDrawing: false,
        drawStartRow: null,
        drawStartCol: null,
        origBoard: null,
        currDrawSymbolId: null,
        highlightedCells: null
    }

    handleMouseDownOnCell = (e, row, col) => {
        if (e.button === MOUSE_LEFT_BTN) {
            let currDrawSymbolId;

            const { cols, boardData } = this.props;

            if (boardData[row][col] === SYMBOL_ID_FILL) {
                // If the clicked cell is FILLED, the drawing mode will be ERASE/EMPTY.
                currDrawSymbolId = SYMBOL_ID_EMPTY;                
            }
            else {
                // Else, start drawing with FILL mode.
                currDrawSymbolId = SYMBOL_ID_FILL;
            }

            const ownCellId = getCellId(cols, row, col);
            let highlightedCells = new Set();
            highlightedCells.add(ownCellId);

            this.setState({
                isDrawing: true,
                drawStartRow: row,
                drawStartCol: col,
                currDrawSymbolId: currDrawSymbolId,
                origBoard: boardClone(boardData),
                highlightedCells: highlightedCells
            });
        }

        document.addEventListener("mouseup", this.handleMouseUp);
    }

    handleMouseEnterOnCell = (cellRow, cellCol) => {
        const { cols } = this.props;
        const { drawStartRow, drawStartCol } = this.state;

        if (this.state.isDrawing) {
            let highlightedCells = getHighlightedCells(cols, drawStartRow, drawStartCol,
                cellRow, cellCol);

            this.setState({
                highlightedCells: highlightedCells
            });
        }
    }

    handleMouseUp = () => {

        let { highlightedCells, origBoard, currDrawSymbolId } = this.state;
        
        if (highlightedCells !== null) {
            highlightedCells.forEach(cellId => {
                let [row, col] = getCellRowCol(cellId, this.props.cols);
                origBoard[row][col] = currDrawSymbolId;
            });
    
            this.props.setBoardData(origBoard);
        }

        this.setState({
            isDrawing: false,
            drawStartRow: null,
            drawStartCol: null,
            origBoard: null,
            highlightedCells: null
        });
        
        document.removeEventListener("mouseup", this.handleMouseUp);
    }

    render() {
        const { rows, cols, cellSize, boardData } = this.props;
        const { highlightedCells, currDrawSymbolId } = this.state;

        let tableRows = [];
        for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
            let rowCells = [];
            for (let colIdx = 0; colIdx < cols; colIdx++) {

                const cellId = getCellId(cols, rowIdx, colIdx);
                const isHighlighted = (highlightedCells !== null) ? highlightedCells.has(cellId) : false;

                rowCells.push(
                    <Cell
                        key={cellId}
                        id={cellId}
                        row={rowIdx}
                        col={colIdx}
                        rows={rows}
                        cols={cols}
                        cellSize={cellSize}
                        symbolId={boardData[rowIdx][colIdx]}
                        isHighlighted={isHighlighted}
                        drawingSymbolId={currDrawSymbolId}
                        handleMouseDown={(e, row, col) => this.handleMouseDownOnCell(e, row, col)}
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

export default connect(mapStateToProps, mapDispatchToProps)(Grid);
