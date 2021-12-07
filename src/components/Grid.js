import React from "react";
import { connect } from "react-redux";
import Cell from "./Cell";
import { getCellId } from "../utils";

import { 
    endDraw,
    moveDraw,
    setCrosshair,
    setPuzzleData,
    startDraw
} from "../redux/actions/board";

import {
    MOUSE_LEFT_BTN,
    MOUSE_RIGHT_BTN,
    SYMBOL_ID_EMPTY,
    SYMBOL_ID_X
} from "../constants";

import "./Board.css";


const mapStateToProps = (state) => {
    return {
        rows: state.board.rows,
        cols: state.board.cols,
        boardData: state.board.data,
        isDrawing: state.board.isDrawing,
        selectedSymbol: state.board.selectedSymbol,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        startDraw: (row, col, symbolId) => dispatch(startDraw(row, col, symbolId)),
        moveDraw: (row, col) => dispatch(moveDraw(row, col)),
        endDraw: () => dispatch(endDraw()),
        setBoardData: (boardData) => dispatch(setPuzzleData(boardData)),
        setCrosshair: (row, col) => dispatch(setCrosshair(row, col))
    };
};


class Grid extends React.Component {

    handleMouseDownOnCell = (e, cellRow, cellCol, cellSymbol) => {
        const { selectedSymbol } = this.props;
        let drawSymbol = null;

        if (e.button === MOUSE_LEFT_BTN) {
            if (cellSymbol === selectedSymbol) {
                // If the clicked cell's symbol is equal to the currently selected symbol,
                // the drawing mode will be ERASE/EMPTY.
                drawSymbol = SYMBOL_ID_EMPTY;                
            }
            else {
                // Else, start drawing with the currently selected symbol.
                drawSymbol = selectedSymbol;
            }
        }
        else if (e.button === MOUSE_RIGHT_BTN) {
            if (cellSymbol === SYMBOL_ID_X) {
                // If the clicked cell is X, the drawing mode will be ERASE/EMPTY.
                drawSymbol = SYMBOL_ID_EMPTY;                
            }
            else {
                // Else, start drawing with the X symbol.
                drawSymbol = SYMBOL_ID_X;
            } 
        }

        if (drawSymbol !== null) {
            this.props.startDraw(cellRow, cellCol, drawSymbol);
        }

        document.addEventListener("mouseup", this.handleMouseUp);
    }

    handleMouseEnterOnCell = (cellRow, cellCol) => {
        const { isDrawing } = this.props;

        if (isDrawing) {
            this.props.moveDraw(cellRow, cellCol);
        }

        this.props.setCrosshair(cellRow, cellCol);
    }

    handleMouseLeaveTable = () => {
        this.props.setCrosshair(null, null);
    }

    handleMouseUp = () => {
        this.props.endDraw();
        document.removeEventListener("mouseup", this.handleMouseUp);
    }

    render() {
        const { rows, cols } = this.props;

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
            <table id="board-table" onMouseLeave={() => this.handleMouseLeaveTable()}>
                <tbody>
                    {tableRows}
                </tbody>
            </table>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Grid);
