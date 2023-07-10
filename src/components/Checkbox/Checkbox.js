import React, { useEffect, useState } from "react";

// IMAGES
import { ReactComponent as Checkmark } from "../../assets/icon-check.svg";

// STYLES
import "./Checkbox.css";

function Checkbox({ checked, clickHandler, registerHandler, isLarge }) {
    const [ isChecked, setIsChecked ] = useState( checked || false );

    // USE EFFECTS
    useEffect(() => {
        setIsChecked( checked || false  );
    }, [ checked ]);

    useEffect(() => {
        setIsChecked(checked || false);
    }, [registerHandler, checked]);

    // HANDLERS
    function handleClick () {
        setIsChecked( prev => !prev );
        clickHandler();
    }

    function handleChange() {
        // Empty function to prevent error messages in the console.
    }

    return (
        <label className={`lbl-checkbox ${ isLarge ? "large" : ""}` }>
            <input
                type="checkbox"
                checked={ isChecked }
                onClick={ handleClick }
                onChange={ handleChange }
                {...( registerHandler ? registerHandler : {} )}
            />

            <span className={ `checkmark ${ isLarge ? "large" : "" }` }>
                { isChecked && <Checkmark className="checkmark-icon" /> }
            </span>
        </label>
    );
}

export default Checkbox;