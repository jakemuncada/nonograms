import React from "react";
import { connect } from "react-redux";

import Cell from "./Cell";
import { startDraw, endDraw, moveDraw } from "../redux/actions/interaction";
import { boardClone, isCellHighlighted } from "../utils";
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
        setBoardData: (boardData) => dispatch(setPuzzleData(boardData)),
        startDraw: (row, col, symbolId) => dispatch(startDraw(row, col, symbolId)),
        endDraw: () => dispatch(endDraw()),
        moveDraw: (row, col) => dispatch(moveDraw(row, col)),
    };
};


class Grid extends React.Component {

    state = {
        isDrawing: false,
        drawStartRow: null,
        drawStartCol: null,
        origBoard: null,
        currDrawSymbolId: null
    }

    handleMouseDownOnCell = (e, row, col) => {
        if (e.button === MOUSE_LEFT_BTN) {
            let currDrawSymbolId;

            // If the clicked cell is FILLED, the drawing mode will be ERASE/EMPTY.
            if (this.props.boardData[row][col] === SYMBOL_ID_FILL) {
                currDrawSymbolId = SYMBOL_ID_EMPTY;                
            }
            else {
                currDrawSymbolId = SYMBOL_ID_FILL;
            }

            this.setState({
                isDrawing: true,
                drawStartRow: row,
                drawStartCol: col,
                currDrawSymbolId: currDrawSymbolId,
                origBoard: boardClone(this.props.boardData)
            });

            let drawingBoard = boardClone(this.props.boardData);
            drawingBoard[row][col] = currDrawSymbolId;
            this.props.setBoardData(drawingBoard);
        }

        document.addEventListener("mouseup", this.handleMouseUp);
    }

    handleMouseEnterOnCell = (cellRow, cellCol) => {
        const { rows, cols } = this.props;
        const { drawStartRow, drawStartCol, currDrawSymbolId } = this.state;

        if (this.state.isDrawing) {
            let drawingBoard = boardClone(this.state.origBoard);
            for (var row = 0; row < rows; row++) {
                for (var col = 0; col < cols; col++) {
                    if (isCellHighlighted(drawStartRow, drawStartCol, cellRow, cellCol, row, col)) {
                        drawingBoard[row][col] = currDrawSymbolId;
                    }
                }
            }

            this.props.setBoardData(drawingBoard);
        }
    }

    handleMouseUp = () => {
        this.setState({
            isDrawing: false,
            drawStartRow: null,
            drawStartCol: null,
            origBoard: null
        });
        
        document.removeEventListener("mouseup", this.handleMouseUp);
    }

    render() {
        const { rows, cols, cellSize, boardData } = this.props;

        let tableRows = [];
        for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
            let rowCells = [];
            for (let colIdx = 0; colIdx < cols; colIdx++) {
                rowCells.push(
                    <Cell
                        key={rowIdx * cols + colIdx}
                        row={rowIdx}
                        col={colIdx}
                        rows={rows}
                        cols={cols}
                        cellSize={cellSize}
                        symbolId={boardData[rowIdx][colIdx]}
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
