import React from "react";
import { connect } from "react-redux";
import { startDraw, endDraw, moveDraw } from "../redux/actions/interaction";
import { MOUSE_LEFT_BTN } from "../constants";

const isHighlight = (isDrawing, sRow, sCol, eRow, eCol, row, col) => {
    if (isDrawing === false) {
        return false;
    }
    if (row === sRow && col === sCol) {
        return true;
    }

    const horiDelta = eCol - sCol;
    const vertDelta = eRow - sRow;
    const isVerticalDraw = Math.abs(vertDelta) > Math.abs(horiDelta);

    // Horizontal Draw
    if (row === sRow && isVerticalDraw === false) {
        if (col >= sCol && col <= eCol) {
            return true;
        }
        if (col <= sCol && col >= eCol) {
            return true;
        }
    }

    // Vertical Draw
    if (col === sCol && isVerticalDraw === true) {
        if (row >= sRow && row <= eRow) {
            return true;
        }
        if (row <= sRow && row >= eRow) {
            return true;
        }
    }

    return false;
};

const mapStateToProps = (state, ownProps) => {
    const { drawStartRow, drawStartCol, drawEndRow, drawEndCol, isDrawing } = state.interaction;
    const ownRow = ownProps.row;
    const ownCol = ownProps.col;

    return {
        COLS: state.board.cols,
        isDrawing: isDrawing,
        isHighlight: isHighlight(isDrawing, drawStartRow, drawStartCol, drawEndRow, drawEndCol, ownRow, ownCol),
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        startDraw: (row, col) => dispatch(startDraw(row, col)),
        endDraw: () => dispatch(endDraw()),
        moveDraw: (row, col, isDrawing) => {
            if (isDrawing) {
                if (row !== ownProps.drawEndRow || col !== ownProps.drawEndCol) {
                    dispatch(moveDraw(row, col));
                }
            }
        },
    };
};

class Cell extends React.Component {
    constructor(props) {
        super(props);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }

    shouldComponentUpdate(nextProps) {
        const { width, height, isHighlight } = this.props;
        return isHighlight !== nextProps.isHighlight || width !== nextProps.width || height !== nextProps.height;
    }

    handleMouseDown(e) {
        if (e.button === MOUSE_LEFT_BTN) {
            const { row, col } = this.props;
            this.props.startDraw(row, col);
            document.addEventListener("mouseup", this.handleMouseUp);
        }
    }

    handleMouseUp() {
        this.props.endDraw();
        document.removeEventListener("mouseup", this.handleMouseUp);
    }

    handleMouseMove() {
        const { row, col, isDrawing, moveDraw } = this.props;
        moveDraw(row, col, isDrawing);
    }

    render() {
        const { COLS, row, col, width, height, isHighlight } = this.props;

        let color = row % 2 === 0 ? (col % 2 === 0 ? "grey" : "white") : col % 2 === 0 ? "white" : "grey";
        if (isHighlight) {
            color = "gold";
        }

        const style = {
            gridRow: row + 1,
            gridCol: col + 1,
            width: width,
            height: height,
            backgroundColor: color,
        };

        return (
            <div
                key={row * COLS + col}
                style={style}
                className="cell nodrag"
                onMouseDown={(e) => this.handleMouseDown(e)}
                onMouseMove={() => this.handleMouseMove()}
            ></div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cell);
