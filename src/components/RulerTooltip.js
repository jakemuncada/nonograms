import React from "react";
import {
    RULER_TOOLTIP_FONT_SIZE,
    RULER_TOOLTIP_HALF_HEIGHT,
    RULER_TOOLTIP_HALF_WIDTH,
    RULER_TOOLTIP_HEIGHT,
    RULER_TOOLTIP_WIDTH,
} from "../common/constants";


function RulerTooltip({ id }) {
    const className = "tooltip ruler noselect";

    const style = {
        width: RULER_TOOLTIP_WIDTH,
        height: RULER_TOOLTIP_HEIGHT,
        left: -(RULER_TOOLTIP_HALF_WIDTH),
        top: -(RULER_TOOLTIP_HALF_HEIGHT),
        lineHeight: `${RULER_TOOLTIP_HEIGHT - 5}px`,
        fontSize: RULER_TOOLTIP_FONT_SIZE,
        borderRadius: `${RULER_TOOLTIP_HALF_HEIGHT}px`
    }

    return (
        <div id={id} className={className} style={style}>
            <span id={id + "-text"} className="noselect"></span>
        </div>
    );
}

export default RulerTooltip;