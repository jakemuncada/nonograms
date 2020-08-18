import React from "react";
import "./App.css";
import Board from "./components/Board";
import input from "./input";

function App() {
    let data = input[0];

    return (
        <div className="App">
            <header className="App-header">
                <Board data={data} />
            </header>
        </div>
    );
}

export default App;
