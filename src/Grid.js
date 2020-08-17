import React from "react";
import { connect } from "react-redux";
import "./Board.css";

import Cell from "./Cell";

const mapStateToProps = (state) => {
    return {
        ROWS: state.board.rows,
        COLS: state.board.cols,
        cellWidth: state.board.cellWidth,
        cellHeight: state.board.cellHeight,
    };
};

class Grid extends React.Component {
    render() {
        const { ROWS, COLS } = this.props;

        let board = [];
        for (let rowIdx = 0; rowIdx < ROWS; rowIdx++) {
            for (let colIdx = 0; colIdx < COLS; colIdx++) {
                board.push(<Cell row={rowIdx} col={colIdx} />);
            }
        }

        return <div className="board">{board}</div>;
    }
}

export default connect(mapStateToProps)(Grid);
