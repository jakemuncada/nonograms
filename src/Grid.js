import React from "react";
import "./Board.css";

function Grid(props) {
    const { rows, cols } = props;

    let board = [];
    for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
        for (let colIdx = 0; colIdx < cols; colIdx++) {
            let color = rowIdx % 2 == 0 ? (colIdx % 2 == 0 ? 'grey' : 'white') : (colIdx % 2 == 0 ? 'white' : 'grey');
            const style = { gridRow: rowIdx + 1, gridCol: colIdx + 1, backgroundColor: color }
            let cell = (
                <div key={rowIdx * cols + colIdx} style={style} className="cell">
                    
                </div>
            );
            board.push(cell);
        }
    }

    return <div className='board'>{board}</div>;
}

export default Grid;
