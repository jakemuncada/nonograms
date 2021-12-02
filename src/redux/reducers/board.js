import { ADJUST_BOARD_SIZE } from "../actionTypes";
import { calcMinBoardWidth, calcMinBoardHeight, calcCellSize } from "../../utils";

const initialState = {
    rows: 30,
    cols: 30,
    boardWidth: 660,
    boardHeight: 660,
    cellSize: calcCellSize(30, 660, 30, 660),
    topCluesRows: 0,
    topCluesArr: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ADJUST_BOARD_SIZE:
            const { width, height } = action.payload;
            let newBoardWidth = state.boardWidth + width;
            let newBoardHeight = state.boardHeight + height;

            newBoardWidth = Math.floor(newBoardWidth);
            newBoardHeight = Math.floor(newBoardHeight);

            const minBoardWidth = calcMinBoardWidth(state.cols);
            const minBoardHeight = calcMinBoardHeight(state.rows);

            newBoardWidth = Math.max(newBoardWidth, minBoardWidth);
            newBoardHeight = Math.max(newBoardHeight, minBoardHeight);

            const newCellSize = calcCellSize(state.rows, newBoardHeight, state);

            return {
                ...state,
                boardWidth: newBoardWidth,
                boardHeight: newBoardHeight,
                cellSize: newCellSize
            };
        default:
            return state;
    }
}
