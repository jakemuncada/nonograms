import Puzzle from "./Puzzle";
import DrawManager from "./DrawManager";
import ClueManager from "./ClueManager";
import CrosshairManager from "./CrosshairManager";
import { DrawingSymbolEnum } from "../common/enums";
import {
    SVG_URL_CLUE_SLASH,
    SVG_URL_FILL,
    SVG_URL_X,
} from "../common/constants";


class NonogramManager {

    puzzle = null;
    drawMgr = null;
    clueMgr = null;
    crosshairMgr = null;
    selectedSymbol = DrawingSymbolEnum.FILL;
    imageCache = {}

    constructor(puzzle) {
        this.puzzle = puzzle;
        this.drawMgr = new DrawManager(puzzle);
        this.clueMgr = new ClueManager(puzzle);
        this.crosshairMgr = new CrosshairManager(puzzle);

        // Preload images. The dict key is not important because we will not use them.
        this.imageCache["fill"] = new Image();
        this.imageCache["fill"].src = SVG_URL_FILL;
        this.imageCache["x"] = new Image();
        this.imageCache["x"].src = SVG_URL_X;
        this.imageCache["clue-slash"] = new Image();
        this.imageCache["clue-slash"].src = SVG_URL_CLUE_SLASH;
    }

    initialize() {
        this.drawMgr.initialize();
        this.clueMgr.initialize();
        this.crosshairMgr.initialize();
    }
}

const nonogram = new NonogramManager(Puzzle); // TODO: Do not import/set puzzle here.
export default nonogram;