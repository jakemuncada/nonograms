import React from "react";

function SymbolX (props) {
    const { size, color } = props;
    const viewBox = `0 0 ${size} ${size}`;

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox}
            width={size} height={size} overflow="hidden"
            stroke={color} strokeWidth="2" strokeLinecap="round" className="symbol-svg">
            <line x1="0" y1="0" x2="100%" y2="100%" />
            <line x1="100%" y1="0" x2="0" y2="100%" />
        </svg>
    );
}

export default SymbolX;