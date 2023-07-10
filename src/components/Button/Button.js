import React from 'react';

// STYLES
import "./Button.css";

function Button({ id, textValue, type, clickHandler, filledStatus, color }) {
    const buttonClassName = color + (filledStatus ? " btn-confirmation btn-filled" : " btn-confirmation btn-clear");

    return (
        <button
            id={ id }
            type={ type }
            onClick={ clickHandler }
            className={ buttonClassName }
        >
            { textValue }
        </button>
    );
}

export default Button;