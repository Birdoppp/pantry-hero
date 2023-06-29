import React, { useEffect, useState } from "react";
import "./Checkbox.css";
import { ReactComponent as Checkmark } from "../../assets/icon-check.svg";

function Checkbox({ checked, clickHandler, registerHandler, isLarge }) {

    const [ isChecked, setIsChecked ] = useState( checked || false );

    useEffect(() => {
        setIsChecked( checked || false );
    }, [checked]);

    function handleClick () {
        clickHandler();
        setIsChecked( prev => !prev );
    }

    return (
        <label className={`lbl-checkbox ${ isLarge ? "large" : ""}` }>
            <input
                type="checkbox"
                defaultChecked={ isChecked }
                onClick={ handleClick }
                {...( registerHandler ? registerHandler : {} )}
            />

            <span className={ `checkmark ${ isLarge ? "large" : "" }` }>
                { isChecked && <Checkmark className="checkmark-icon" /> }
            </span>
        </label>
    );
}

export default Checkbox;