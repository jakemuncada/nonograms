import React from "react";
import { connect } from "react-redux";
import Grid from "./Grid";
import TopPanel from "./TopPanel";
import LeftPanel from "./LeftPanel";

const mapStateToProps = (state) => {
    return {
        rows: state.board.rows,
        cols: state.board.cols,
        cellWidth: state.board.cellWidth,
        cellHeight: state.board.cellHeight,
    };
};

class Board extends React.Component {
    render() {
        const { rows, cols, cellWidth, cellHeight } = this.props;

        return (
            <div className="board">
                <div id="top-container">
                    <TopPanel data={this.props.data.top} cellWidth={cellWidth} />
                </div>
                <div id="grid-container">
                    <Grid rows={rows} cols={cols} cellWidth={cellWidth} cellHeight={cellHeight} />
                </div>
                <div id="left-container">
                    <LeftPanel data={this.props.data.left} cellHeight={cellHeight} />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Board);
