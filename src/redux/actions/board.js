import { ADJUST_BOARD_SIZE, ADJUST_CELL_SIZE } from "../actionTypes";

export const adjustBoardSize = (widthAdj, heightAdj) => ({
    type: ADJUST_BOARD_SIZE,
    payload: {
        width: widthAdj,
        height: heightAdj,
    },
});

export const adjustCellSize = (amount) => ({
    type: ADJUST_CELL_SIZE,
    payload: {
        amount: amount
    },
});