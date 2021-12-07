import React from "react";
import { connect } from "react-redux";
import "./App.css";
import Board from "./components/Board";
import input from "./input";
import { resetPuzzleData } from "./redux/actions/board";
import { setLeftClues, setTopClues } from "./redux/actions/clues";

const mapDispatchToProps = (dispatch) => {
    return {
        setPuzzle: (puzzleData) => {
            const rows = puzzleData.rows;
            const cols = puzzleData.cols;
            const topClues = puzzleData.top;
            const leftClues = puzzleData.left;
            dispatch(setTopClues(rows, cols, topClues));
            dispatch(setLeftClues(rows, cols, leftClues));
            dispatch(resetPuzzleData(rows, cols));
        }
    }
}

function App(props) {
    let puzzleData = input[2];
    props.setPuzzle(puzzleData);

    return (
        <div className="App">
            <div className="App-body">
                <Board data={puzzleData} />
            </div>
        </div>
    );
}

export default connect(null, mapDispatchToProps)(App);
