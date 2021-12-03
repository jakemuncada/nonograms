import React from "react";

function SymbolSquare (props) {
    const { size, color } = props;
    const viewBox = `0 0 ${size} ${size}`;

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox}
            width={size} height={size} overflow="hidden"
            fill={color} stroke={color} strokeWidth="1" className="symbol-svg">
            <rect width={size} height={size} />
        </svg>
    );
}

export default SymbolSquare;