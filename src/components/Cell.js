import React from "react";
import { connect } from "react-redux";
import { SYMBOL_ID_FILL } from "../constants";
import { startDraw, endDraw, moveDraw } from "../redux/actions/interaction";


// const mapStateToProps = (state, ownProps) => {
//     const { drawStartRow, drawStartCol, drawEndRow, drawEndCol,
//         isDrawing } = state.interaction;

//     const ownRow = ownProps.row;
//     const ownCol = ownProps.col;

//     return {
//         cols: state.board.cols,
//         isDrawing: isDrawing,
//         currSymbolId: state.interaction.currSymbolId,
//         isHighlight: isHighlight(isDrawing, drawStartRow, drawStartCol,
//             drawEndRow, drawEndCol, ownRow, ownCol),
//     };
// };

// const mapDispatchToProps = (dispatch, ownProps) => {
//     return {
//         startDraw: (row, col, symbolId) => dispatch(startDraw(row, col, symbolId)),
//         endDraw: () => dispatch(endDraw()),
//         moveDraw: (row, col, isDrawing) => {
//             if (isDrawing) {
//                 if (row !== ownProps.drawEndRow || col !== ownProps.drawEndCol) {
//                     dispatch(moveDraw(row, col));
//                 }
//             }
//         },
//     };
// };

class Cell extends React.Component {

    shouldComponentUpdate(nextProps) {
        const { width, height, symbolId } = this.props;
        return symbolId !== nextProps.symbolId || width !== nextProps.width || height !== nextProps.height;
    }

    render() {
        const { cols, row, col, width, height,
            symbolId, handleMouseDown, handleMouseEnter } = this.props;

        const style = {
            width: width,
            height: height,
            backgroundColor: (symbolId == SYMBOL_ID_FILL) ? "black" : "#f0f0f0",
        };

        return (
            <td
                key={row * cols + col}
                style={style}
                className="cell nodrag bordered"
                onMouseDown={(e) => handleMouseDown(e, row, col)}
                onMouseEnter={() => handleMouseEnter(row, col)}
            ></td>
        );
    }
}

export default Cell;
