import React from 'react';
import './Checkbox.css';
import { ReactComponent as Checkmark } from '../../assets/icon-check.svg';

function Checkbox({ checked, clickHandler, registerHandler, isLarge }) {
    function handleChange() {
        console.log("checkbox clicked");
    }

    return (
        <label className={`lbl-checkbox ${isLarge ? "large" : ""}`}>
            <input
                type="checkbox"
                checked={ checked }
                onClick={ clickHandler }
                onChange={ handleChange }
                {...(registerHandler ? registerHandler : {})}
            />
            <span className={`checkmark ${isLarge ? "large" : ""}`}>
                {checked && <Checkmark className="checkmark-icon" />}
            </span>
        </label>
    );
}

export default Checkbox;