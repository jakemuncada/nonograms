import React from "react";
import { connect } from "react-redux";
import Grid from "./Grid";
import TopPanel from "./TopPanel";
import LeftPanel from "./LeftPanel";

const mapStateToProps = (state) => {
    return {
        rows: state.board.rows,
        cols: state.board.cols,
        boardWidth: state.board.boardWidth,
        boardHeight: state.board.boardHeight,
        cellSize: state.board.cellSize,
        topClueRows: state.clues.topClueRows,
        topClueCols: state.clues.topClueCols,
        topClueData: state.clues.topClueData,
        leftClueRows: state.clues.leftClueRows,
        leftClueCols: state.clues.leftClueCols,
        leftClueData: state.clues.leftClueData,
    };
};

class Board extends React.Component {
    render() {
        const { 
            rows, cols,
            boardWidth, boardHeight, cellSize,
            topClueRows, topClueCols, leftClueRows, leftClueCols,
            topClueData, leftClueData
         } = this.props;

        return (
            <div className="board">
                <div id="top-container">
                    <TopPanel rows={topClueRows} cols={topClueCols} 
                        data={topClueData} cellSize={cellSize} />
                </div>
                <div id="grid-container">
                    <Grid
                        rows={rows} cols={cols} cellSize={cellSize}
                        boardWidth={boardWidth} boardHeight={boardHeight} />
                </div>
                <div id="left-container">
                    <LeftPanel rows={leftClueRows} cols={leftClueCols} 
                        data={leftClueData} cellSize={cellSize} />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Board);
