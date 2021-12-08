import React from "react";
import { connect } from "react-redux";
import Grid from "./Grid";
import TopPanel from "./TopPanel";
import LeftPanel from "./LeftPanel";
import nonogram from "../control/nonogram";
import { adjustCellSize } from "../redux/actions/board";
import { MOUSE_MID_BTN } from "../constants";

const mapStateToProps = (state) => {
    return {
        rows: state.board.rows,
        cols: state.board.cols,
        cellSize: state.board.cellSize,
        topClueRows: state.board.topClueRows,
        topClueCols: state.board.topClueCols,
        topClueData: state.board.topClueData,
        leftClueRows: state.board.leftClueRows,
        leftClueCols: state.board.leftClueCols,
        leftClueData: state.board.leftClueData,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        zoomIn: (amount) => { dispatch(adjustCellSize(amount)) },
        zoomOut: (amount) => { dispatch(adjustCellSize(-amount)) },
    }
}

class Board extends React.Component {

    boardElem = null;
    isPanning = false;
    panOrigX = null;
    panOrigY = null;
    origOffsetX = 0;
    origOffsetY = 0;
    currOffsetX = 0;
    currOffsetY = 0;

    componentDidUpdate() {
        this.boardElem = document.getElementById("board");
        nonogram.initialize();
    }

    handleMouseDown = (e) => {
        if (e.button === MOUSE_MID_BTN) {
            e.preventDefault();
            this.isPanning = true;
            this.panOrigX = e.screenX;
            this.panOrigY = e.screenY;
            this.origOffsetX = this.currOffsetX;
            this.origOffsetY = this.currOffsetY;
        }
        document.addEventListener("mouseup", this.handleMouseUp);
    }

    handleMouseMove = (e) => {
        if (this.isPanning) {
            let deltaX = e.screenX - this.panOrigX;
            let deltaY = e.screenY - this.panOrigY;
            let newOffsetX = this.origOffsetX + deltaX;
            let newOffsetY = this.origOffsetY + deltaY;

            this.currOffsetX = newOffsetX;
            this.currOffsetY = newOffsetY;
            this.boardElem.style.transform = `translate(${newOffsetX}px, ${newOffsetY}px)`;
        }
    }

    handleMouseUp = (e) => {
        if (e.button === MOUSE_MID_BTN) {
            this.isPanning = false;
            this.panOrigX = null;
            this.panOrigY = null;
        }
        document.removeEventListener("mouseup", this.handleMouseUp);
    }

    handleMouseWheel = (e) => {
        if (e.deltaY > 0) {
            this.props.zoomOut(2);
        }
        else if (e.deltaY < 0) {
            this.props.zoomIn(2);
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

    preventDefault = (e) => {
        e = e || window.event;
        if (e.preventDefault) {
          e.preventDefault();
        }
        e.returnValue = false;
    }

    render() {
        const {
            rows,
            cols,
            cellSize,
            topClueRows,
            topClueData,
            leftClueCols,
            leftClueData,
        } = this.props;

        return (
            <div id="board-container">
                <div id="board-parent"
                    onMouseEnter={() => this.disableScroll()}
                    onMouseDown={(e) => this.handleMouseDown(e)}
                    onMouseMove={(e) => this.handleMouseMove(e)}
                    onMouseLeave={() => this.enableScroll()}
                    onWheel={(e) => this.handleMouseWheel(e)}>

                    <div id="board">
                        <div id="top-container">
                            <TopPanel
                                rows={topClueRows} cols={cols}
                                cellSize={cellSize}
                                data={topClueData} />
                        </div>
                        <div id="grid-container">
                            <Grid rows={rows} cols={cols} cellSize={cellSize} />
                        </div>
                        <div id="left-container">
                            <LeftPanel 
                                rows={rows} cols={leftClueCols}
                                cellSize={cellSize}
                                data={leftClueData} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);
