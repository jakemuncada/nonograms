import React from "react";
import Grid from "./Grid";
import { connect } from "react-redux";
import { MOUSE_MID_BTN } from "../constants";
import { adjustBoardPos } from "../redux/actions/board";

const mapStateToProps = (state) => {
    return {
        boardX: state.board.boardPosX,
        boardY: state.board.boardPosY,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setBoardPos: (newX, newY) => dispatch(adjustBoardPos(newX, newY)),
    };
};

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.handleStartDrag = this.handleStartDrag.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);

        this.state = {
            isDragging: false,
            dragStartX: 0,
            dragStartY: 0,
            dragStartBoardPosX: props.boardX,
            dragStartBoardPosY: props.boardY,
        };
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleStartDrag);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleStartDrag);
        document.removeEventListener("mousemove", this.handleDrag);
        document.removeEventListener("mouseup", this.handleDragEnd);
    }

    handleStartDrag(e) {
        if (e.button === MOUSE_MID_BTN) {
            this.setState({
                isDragging: true,
                dragStartX: e.screenX,
                dragStartY: e.screenY,
                dragStartBoardPosX: this.props.boardX,
                dragStartBoardPosY: this.props.boardY,
            });
            document.addEventListener("mousemove", this.handleDrag);
            document.addEventListener("mouseup", this.handleDragEnd);
        }
    }

    handleDrag(e) {
        const { isDragging, dragStartX, dragStartY, dragStartBoardPosX, dragStartBoardPosY } = this.state;
        if (isDragging) {
            const deltaX = e.screenX - dragStartX;
            const deltaY = e.screenY - dragStartY;
            const newX = dragStartBoardPosX + deltaX;
            const newY = dragStartBoardPosY + deltaY;
            this.props.setBoardPos(newX, newY);
        }
    }

    handleDragEnd() {
        this.setState({ isDragging: false });
        document.removeEventListener("mousemove", this.handleDrag);
        document.removeEventListener("mouseup", this.handleDragEnd);
    }

    render() {
        const { boardX, boardY } = this.props;

        const style = {
            transform: "translate3d(" + boardX + "px, " + boardY + "px, 0px)",
        };

        return (
            <div className="grid-container">
                <div style={style} className="board">
                    <Grid />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);
