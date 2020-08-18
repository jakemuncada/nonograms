import { ADJUST_SIZE } from "../actionTypes";

export const adjustCellSize = (newWidth, newHeight) => ({
    type: ADJUST_SIZE,
    payload: {
        width: newWidth,
        height: newHeight,
    },
});
