import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import Puzzle from "./control/Puzzle";
import input from "./input";
import { setPuzzle } from "./redux/actions/board";

const puzzleData = input[0];
Puzzle.initialize(puzzleData);

store.dispatch(setPuzzle(
    Puzzle.rows,
    Puzzle.cols,
    Puzzle.topClueRows,
    Puzzle.topClueData,
    Puzzle.leftClueCols,
    Puzzle.leftClueData));

document.addEventListener('contextmenu', event => event.preventDefault());

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
