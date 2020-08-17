import React from "react";
import "./App.css";
import Grid from "./Grid";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <Grid rows={30} cols={30} />
            </header>
        </div>
    );
}

export default App;
