import React, { useEffect } from "react";
import { connect } from "react-redux";
import "./App.css";
import Board from "./components/Board";
import input from "./input";
import { setPuzzle } from "./redux/actions/board";

const mapDispatchToProps = (dispatch) => {
    return {
        setPuzzle: (puzzleData) => dispatch(setPuzzle(puzzleData))
    }
}

function App(props) {
    const { setPuzzle } = props;

    useEffect(() => {
        const puzzleData = input[0];
        setPuzzle(puzzleData);
        // eslint-disable-next-line
    }, []);

    return (
        <div className="App">
            <div className="App-body">
                <Board />
            </div>
        </div>
    );
}

export default connect(null, mapDispatchToProps)(App);
