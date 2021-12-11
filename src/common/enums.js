/** Enum for the drawing direction. */
export const DrawingDirEnum = {
    NONE: "NONE",
    POINT: "POINT",
    VERTICAL: "VERTICAL",
    HORIZONTAL: "HORIZONTAL",
};

/** Enum for the drawing symbol. */
export const DrawingSymbolEnum = {
    EMPTY: "EMPTY",
    FILL: "FILL",
    X: "X",
}

/** Enum for MouseEvent.button. */
export const MouseButtonEnum = {
    LEFT: 0,
    MID: 1,
    RIGHT: 2,
}

// 
/** Enum for MouseEvent.buttons. It is different from MouseEvent.button. */
export const MouseButtonsEnum = {
    LEFT: 1,
    RIGHT: 2,
}

if (Object.freeze) {
    Object.freeze(DrawingDirEnum);
    Object.freeze(DrawingSymbolEnum);
    Object.freeze(MouseButtonEnum);
    Object.freeze(MouseButtonEnum);
}