import { ADJUST_SIZE } from "../actionTypes";

export const adjustCellSize = (w, h) => ({
    type: ADJUST_SIZE,
    payload: {
        width: w,
        height: h,
    },
});
