import Puzzle from "./Puzzle";
import DrawManager from "./DrawManager";
import ClueManager from "./ClueManager";
import CrosshairManager from "./CrosshairManager";
import {
    SVG_URL_CLUE_SLASH,
    SVG_URL_FILL,
    SVG_URL_X,
} from "../common/constants";

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

    /**
     * Initialize the various managers and their DOM elements.
     * Should be called after the DOM is loaded.
     */
    initialize() {
        this.drawMgr.initialize();
        this.clueMgr.initialize();
        this.crosshairMgr.initialize();
    }
}

const nonogram = new NonogramManager(Puzzle); // TODO: Do not import/set puzzle here.
export default nonogram;