import React from "react";
import { connect } from "react-redux";
import Grid from "./Grid";
import TopPanel from "./TopPanel";
import LeftPanel from "./LeftPanel";
import { adjustCellSize } from "../redux/actions/board";
import { CELL_WIDTH_MIN, MOUSE_MID_BTN } from "../constants";

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

    state = {
        isPanning: false,
        panOrigX: null,
        panOrigY: null,
        origOffsetX: 0,
        origOffsetY: 0,
        currOffsetX: 0,
        currOffsetY: 0
    }

    handleMouseDown = (e) => {
        if (e.button === MOUSE_MID_BTN) {
            e.preventDefault();
            this.setState({
                isPanning: true,
                panOrigX: e.screenX,
                panOrigY: e.screenY,
                origOffsetX: this.state.currOffsetX,
                origOffsetY: this.state.currOffsetY
            });
        }
        document.addEventListener("mouseup", this.handleMouseUp);
    }

    handleMouseMove = (e) => {
        if (this.state.isPanning) {
            let deltaX = e.screenX - this.state.panOrigX;
            let deltaY = e.screenY - this.state.panOrigY;
            let newOffsetX = this.state.origOffsetX + deltaX;
            let newOffsetY = this.state.origOffsetY + deltaY;
            
            this.setState({
                currOffsetX: newOffsetX,
                currOffsetY: newOffsetY
            });
        }
    }

    handleMouseUp = (e) => {
        if (e.button === MOUSE_MID_BTN) {
            this.setState({
                isPanning: false,
                panOrigX: null,
                panOrigY: null
            });
        }
        document.removeEventListener("mouseup", this.handleMouseUp);
    }

    handleMouseWheel = (e) => {
        if (e.deltaY > 0) {
            if (this.props.cellSize > CELL_WIDTH_MIN) {
                this.props.zoomOut(2);
            }
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
        const { currOffsetX, currOffsetY } = this.state;

        const { 
            cellSize,
            topClueRows, topClueCols,
            leftClueRows, leftClueCols,
            topClueData, leftClueData
         } = this.props;

        let style = {transform: `translate(${currOffsetX}px, ${currOffsetY}px)`}

        return (
            <div id="board-container">
                <div id="board-parent"
                    onMouseEnter={() => this.disableScroll()}
                    onMouseDown={(e) => this.handleMouseDown(e)}
                    onMouseMove={(e) => this.handleMouseMove(e)}
                    onMouseLeave={() => this.enableScroll()}
                    onWheel={(e) => this.handleMouseWheel(e)}>

                    <div id="board" style={style}>

                        <div id="top-container">
                            <TopPanel rows={topClueRows} cols={topClueCols} 
                                data={topClueData} cellSize={cellSize} />
                        </div>
                        <div id="grid-container">
                            <Grid />
                        </div>
                        <div id="left-container">
                            <LeftPanel rows={leftClueRows} cols={leftClueCols} 
                                data={leftClueData} cellSize={cellSize} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);
