import React from "react";

// DEPENDENCIES
import Slider from "rc-slider";

// STYLES
import "rc-slider/assets/index.css";
import "./RangeSelector.css"


function RangeSelector({ rangeMin, rangeMax, range, rangeSetter }) {
    // HANDLERS
    const handleSliderChange = ( value ) => {
        rangeSetter( value );
    };

    return (
        <>
            <div id="calorie-value-displays">
                <label className="value-display">{ range[0] }</label>
                <label className="value-display">{ range[1] }</label>
            </div>

            <div className="slider-container">
                <Slider
                    range
                    min={ rangeMin }
                    max={ rangeMax }
                    allowCross={ false }
                    value={ range }
                    onChange={ handleSliderChange }
                />
            </div>
        </>
    );
}

export default RangeSelector;
