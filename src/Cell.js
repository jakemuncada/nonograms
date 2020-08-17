import React from "react";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
    return {
        COLS: state.board.cols,
    };
};

class Cell extends React.Component {
    render() {
        const { COLS, row, col } = this.props;

        let color = row % 2 === 0 ? (col % 2 === 0 ? "grey" : "white") : col % 2 === 0 ? "white" : "grey";
        const style = {
            gridRow: row + 1,
            gridCol: col + 1,
            backgroundColor: color,
        };

        return <div key={row * COLS + col} style={style} className="cell"></div>;
    }
}

export default connect(mapStateToProps)(Cell);
