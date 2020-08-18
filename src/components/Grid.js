import React from "react";
import { connect } from "react-redux";
import "./Board.css";

import Cell from "./Cell";
import { adjustCellSize } from "../redux/actions/board";

const mapStateToProps = (state) => {
    return {
        ROWS: state.board.rows,
        COLS: state.board.cols,
        cellWidth: state.board.cellWidth,
        cellHeight: state.board.cellHeight
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setCellSize: (w, h) => dispatch(adjustCellSize(w, h)),
    };
};

class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.handleMouseWheel = this.handleMouseWheel.bind(this);
    }

    componentDidMount() {
        document.addEventListener("wheel", this.handleMouseWheel);
    }

    componentWillUnmount() {
        document.removeEventListener("wheel", this.handleMouseWheel);
    }

    handleMouseWheel(e) {
        e.preventDefault();
        if (e.deltaY !== 0) {
            const pxDelta = (e.deltaY * -1) / 66.0;
            this.props.setCellSize(pxDelta, pxDelta);
        }
        return false;
    }

    render() {
        const { ROWS, COLS, cellWidth, cellHeight } = this.props;

        let board = [];
        for (let rowIdx = 0; rowIdx < ROWS; rowIdx++) {
            for (let colIdx = 0; colIdx < COLS; colIdx++) {
                board.push(
                    <Cell
                        key={rowIdx * COLS + colIdx}
                        row={rowIdx}
                        col={colIdx}
                        width={cellWidth}
                        height={cellHeight}
                    />
                );
            }
        }

        return <>{board}</>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Grid);
