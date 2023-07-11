import React from "react";

// DEPENDENCIES
import Slider from "rc-slider";

// STYLES
import 'rc-slider/assets/index.css';
import "./SliderSelector.css"

function SliderSelector({ value, setter }) {

    // HANDLERS
    const handleSliderChange = ( value ) => {
        setter( value );
    };

    return (
        <>
            <div id="slider-value-display">
                <p>Under</p>
                <label className="value-display">{ value }</label>
                <p>Minutes</p>
            </div>


            <div className="slider-container">
                <Slider
                    max={ 180 }
                    min={ 15 }
                    value={ value }
                    onChange={ handleSliderChange }
                />
            </div>
        </>
    );
}

export default SliderSelector;