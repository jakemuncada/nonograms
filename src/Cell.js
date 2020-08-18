import React from "react";
import { connect } from "react-redux";
import { startDrag, endDrag, moveDrag } from "./redux/actions/interaction";

const MOUSE_LEFT = 0;

const isHighlight = (isDragging, sRow, sCol, eRow, eCol, row, col) => {
    if (isDragging === false) {
        return false;
    }
    if (row === sRow && col === sCol) {
        return true;
    }

    const horiDelta = eCol - sCol;
    const vertDelta = eRow - sRow;
    const isVerticalDrag = Math.abs(vertDelta) > Math.abs(horiDelta);

    // Horizontal Drag
    if (row === sRow && isVerticalDrag === false) {
        if (col >= sCol && col <= eCol) {
            return true;
        }
        if (col <= sCol && col >= eCol) {
            return true;
        }
    }

    // Vertical Drag
    if (col === sCol && isVerticalDrag === true) {
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
    const { dragStartRow, dragStartCol, dragEndRow, dragEndCol, isDragging } = state.interaction;
    const ownRow = ownProps.row;
    const ownCol = ownProps.col;

    return {
        COLS: state.board.cols,
        isDragging: isDragging,
        isHighlight: isHighlight(isDragging, dragStartRow, dragStartCol, dragEndRow, dragEndCol, ownRow, ownCol),
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        startDrag: (row, col) => dispatch(startDrag(row, col)),
        endDrag: () => dispatch(endDrag()),
        moveDrag: (row, col, isDragging) => {
            if (isDragging) {
                if (row !== ownProps.dragEndRow || col !== ownProps.dragEndCol) {
                    dispatch(moveDrag(row, col));
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
        return this.props.isHighlight !== nextProps.isHighlight;
    }

    handleMouseDown(e) {
        if (e.button === MOUSE_LEFT) {
            const { row, col } = this.props;
            this.props.startDrag(row, col);
            document.addEventListener("mouseup", this.handleMouseUp);
        }
    }

    handleMouseUp() {
        this.props.endDrag();
        document.removeEventListener("mouseup", this.handleMouseUp);
    }

    handleMouseMove() {
        const { row, col, isDragging, moveDrag } = this.props;
        moveDrag(row, col, isDragging);
    }

    render() {
        const { COLS, row, col, isHighlight } = this.props;

        let color = row % 2 === 0 ? (col % 2 === 0 ? "grey" : "white") : col % 2 === 0 ? "white" : "grey";
        if (isHighlight) {
            color = "gold";
        }

        const style = {
            gridRow: row + 1,
            gridCol: col + 1,
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
