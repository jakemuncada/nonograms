import React from "react";
import { connect } from "react-redux";
import Grid from "./Grid";
import TopPanel from "./TopPanel";
import LeftPanel from "./LeftPanel";
import { adjustBoardSize, adjustCellSize } from "../redux/actions/board";

const mapStateToProps = (state) => {
    return {
        rows: state.board.rows,
        cols: state.board.cols,
        cellSize: state.board.cellSize,
        topClueRows: state.clues.topClueRows,
        topClueCols: state.clues.topClueCols,
        topClueData: state.clues.topClueData,
        leftClueRows: state.clues.leftClueRows,
        leftClueCols: state.clues.leftClueCols,
        leftClueData: state.clues.leftClueData,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        zoomIn: (amount) => { dispatch(adjustCellSize(amount)) },
        zoomOut: (amount) => { dispatch(adjustCellSize(-amount)) },
    }
}

class Board extends React.Component {

    handleMouseWheel(e) {
        if (e.deltaY > 0) {
            this.props.zoomOut(1);
        }
        else if (e.deltaY < 0) {
            this.props.zoomIn(1);
        }
    }

    disableScroll = () => {
        document.addEventListener('wheel', this.preventDefault, {
            passive: false,
        })
    }

    enableScroll = () => {
        document.removeEventListener('wheel', this.preventDefault, false)
    }

    preventDefault(e) {
        e = e || window.event;
        if (e.preventDefault) {
          e.preventDefault();
        }
        e.returnValue = false;
    }

    render() {
        const { 
            rows, cols, cellSize,
            topClueRows, topClueCols,
            leftClueRows, leftClueCols,
            topClueData, leftClueData
         } = this.props;

        return (
            <div className="board" 
                onMouseEnter={() => this.disableScroll()}
                onMouseLeave={() => this.enableScroll()}
                onWheel={(e) => this.handleMouseWheel(e)}>
                <div id="top-container">
                    <TopPanel rows={topClueRows} cols={topClueCols} 
                        data={topClueData} cellSize={cellSize} />
                </div>
                <div id="grid-container">
                    <Grid
                        rows={rows} cols={cols} cellSize={cellSize} />
                </div>
                <div id="left-container">
                    <LeftPanel rows={leftClueRows} cols={leftClueCols} 
                        data={leftClueData} cellSize={cellSize} />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);
