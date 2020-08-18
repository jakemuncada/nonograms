import { ADJUST_SIZE, ADJUST_POS } from "../actionTypes";

export const adjustCellSize = (newWidth, newHeight) => ({
    type: ADJUST_SIZE,
    payload: {
        width: newWidth,
        height: newHeight,
    },
});

export const adjustBoardPos = (newPosX, newPosY) => ({
    type: ADJUST_POS,
    payload: {
        newPosX: newPosX,
        newPosY: newPosY,
    },
});
