/**
 * Enum for the clue status.
 * @enum {number}
 */
export const ClueStatusEnum = {
    BLANK: 0,
    UNFINISHED: 1,
    FINISHED: 2,
}

/**
 * The type of clue.
 * @enum {string}
 */
export const ClueTypeEnum = {
    TOP: "CLUE_TYPE_TOP",
    LEFT: "CLUE_TYPE_LEFT"
}

/** 
 * Enum for the drawing direction.
 * @enum {string}
 */
export const DrawingDirEnum = {
    NONE: "NONE",
    POINT: "POINT",
    VERTICAL: "VERTICAL",
    HORIZONTAL: "HORIZONTAL",
};

/**
 * Enum for the drawing symbol.
 * @enum {string}
 */
export const DrawingSymbolEnum = {
    EMPTY: "EMPTY",
    FILL: "FILL",
    X: "X",
}

/**
 * Enum for MouseEvent.button.
 * @enum {number}
 */
export const MouseButtonEnum = {
    LEFT: 0,
    MID: 1,
    RIGHT: 2,
}

/**
 * Enum for MouseEvent.buttons. It is different from MouseEvent.button.
 * @enum {number}
 */
export const MouseButtonsEnum = {
    LEFT: 1,
    RIGHT: 2,
}

/**
 * Enum for the ruler direction.
 * @enum {string}
 */
export const RulerDir = {
    V: "RULER_DIR_VERTICAL",
    H: "RULER_DIR_HORIZONTAL"
}

if (Object.freeze) {
    Object.freeze(ClueStatusEnum);
    Object.freeze(ClueTypeEnum);
    Object.freeze(DrawingDirEnum);
    Object.freeze(DrawingSymbolEnum);
    Object.freeze(MouseButtonEnum);
    Object.freeze(MouseButtonEnum);
    Object.freeze(RulerDir);
}