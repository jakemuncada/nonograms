import { ADJUST_SIZE } from "../actionTypes";

export const incSize = (w, h) => ({
    type: ADJUST_SIZE,
    payload: {
        width: w,
        height: h,
    },
});

export const decSize = (w, h) => ({
    type: ADJUST_SIZE,
    payload: {
        width: -w,
        height: -h,
    },
});
