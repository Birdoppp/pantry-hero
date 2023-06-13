import React from 'react';
import "./Button.css";

function Button({ textValue, type, clickHandler, filledStatus }) {
    const buttonClassName = filledStatus ? "btn-confirmation btn-filled" : "btn-confirmation btn-clear";

    return (
        <button
            type={ type }
            onClick={ clickHandler }
            className={ buttonClassName }
        >
            { textValue }
        </button>
    );
}

export default Button;