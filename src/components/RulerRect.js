import React from "react";

export default function RulerRect(props) {
    const { id, cellSize } = props;

    const style = {
        width: cellSize,
        height: cellSize
    };

    return (
        <div id={id} className="ruler-rect abs" style={style} />
    );
}