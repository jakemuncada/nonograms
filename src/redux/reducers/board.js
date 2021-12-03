import { SYMBOL_ID_EMPTY } from "../../constants";
import { boardClone } from "../../utils";
import { SET_PUZZLE_DATA, RESET_PUZZLE_DATA, ADJUST_CELL_SIZE } from "../actionTypes";

const initialState = {
    rows: 30,
    cols: 30,
    cellSize: 23,
    data: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ADJUST_CELL_SIZE:
            const { amount } = action.payload;
            return {
                ...state,
                cellSize: state.cellSize + amount
            }

        case RESET_PUZZLE_DATA:
            const { rows, cols } = action.payload;
            
            let newData = [];
            for (let row = 0; row < rows; row++) {
                newData.push([]);
                for (let col = 0; col < cols; col++) {
                    let value = SYMBOL_ID_EMPTY;
                    newData[row].push(value);
                }
            }

            return {
                ...state,
                rows: rows,
                cols: cols,
                data: newData
            }

        case SET_PUZZLE_DATA:
            return {
                ...state,
                data: boardClone(action.payload.data)
            }

        default:
            return state;
    }
}
