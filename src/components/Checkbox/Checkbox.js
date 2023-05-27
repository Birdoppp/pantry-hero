import React from 'react';
import "./Checkbox.css"
import { ReactComponent as Checkmark } from "../../assets/icon-check.svg"


function Checkbox({ id, checked, clickHandler, registerHandler }) {
    return (
        <label className="lbl-checkbox">
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onClick={clickHandler}
                { ...registerHandler }
            />
            <span className="checkmark">
        {checked && <Checkmark />}
      </span>
        </label>
    );
}

export default Checkbox;