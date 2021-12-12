import Puzzle from "./Puzzle";
import DrawManager from "./DrawManager";
import ClueManager from "./ClueManager";
import CrosshairManager from "./CrosshairManager";
import RulerManager from "./RulerManager";
import {
    SVG_URL_CLUE_SLASH,
    SVG_URL_FILL,
    SVG_URL_X,
} from "../common/constants";
import ElementManager from "./ElementManager";

/**
 * Class responsible for the entire Nonograms app.
 */
class NonogramManager {

    /**
     * The puzzle object.
     * @type {Puzzle}
     */
    puzzle = null;

    /**
     * The DrawManager.
     * @type {DrawManager}
     */
    drawMgr = null;

    /**
     * The ClueManager.
     * @type {ClueManager}
     */
    clueMgr = null;

    /**
     * The CrosshairManager.
     * @type {CrosshairManager}
     */
    crosshairMgr = null;

    /**
     * The RulerManager.
     * @type {RulerManager}
     */
    rulerMgr = null;

    /**
     * The image cache. It is only for storing the preloaded images.
     * @type {Object}
     */
    imageCache = {}

    /**
     * Constructor.
     * @param {Puzzle} puzzle The puzzle object.
     */
    constructor(puzzle) {
        this.puzzle = puzzle;
        this.elemMgr = new ElementManager(puzzle);
        this.drawMgr = new DrawManager(puzzle, this.elemMgr);
        this.clueMgr = new ClueManager(puzzle, this.elemMgr);
        this.rulerMgr = new RulerManager(puzzle, this.elemMgr);
        this.crosshairMgr = new CrosshairManager(puzzle, this.elemMgr);

        // Preload images. The dict key is not important because we will not use them.
        this.imageCache["fill"] = new Image();
        this.imageCache["fill"].src = SVG_URL_FILL;
        this.imageCache["x"] = new Image();
        this.imageCache["x"].src = SVG_URL_X;
        this.imageCache["clue-slash"] = new Image();
        this.imageCache["clue-slash"].src = SVG_URL_CLUE_SLASH;
    }

    /**
     * Initialize the various managers and their DOM elements.
     * Should be called after the DOM is loaded.
     */
    initialize() {
        this.elemMgr.initialize();
    }
}

const nonogram = new NonogramManager(Puzzle); // TODO: Do not import/set puzzle here.
export default nonogram;