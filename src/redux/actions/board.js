import { ADJUST_BOARD_SIZE } from "../actionTypes";

export const adjustCellSize = (newWidth, newHeight) => ({
    type: ADJUST_BOARD_SIZE,
    payload: {
        width: newWidth,
        height: newHeight,
    },
});
