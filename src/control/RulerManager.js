/** Class responsible for the rulers and its measurement tooltips. */
export default class RulerManager {

    /**
     * The puzzle object.
     * @type {Puzzle}
     */
    puzzle = null;

    /**
     * The ElementManager containing the DOM elements.
     * @type {ElementManager}
     */
    elemMgr = null;

    /**
     * Constructor.
     * @param {Puzzle} puzzle The puzzle object.
     * @param {ElementManager} elemMgr The ElementManager.
     */
    constructor(puzzle, elemMgr) {
        this.puzzle = puzzle;
        this.elemMgr = elemMgr;
    }

    /**
     * Hide all rulers.
     */
    hideAll() {
        this.hideHorizontal();
        this.hideVertical();
    }

    /**
     * Hide the horizontal rulers.
     */
    hideHorizontal() {
        this.elemRectH.style.visibility = "hidden";
    }

    /**
     * Hide the vertical rulers.
     */
    hideVertical() {
        this.elemRectV.style.visibility = "hidden";
    }

}