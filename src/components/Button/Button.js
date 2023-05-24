import React from 'react';
import "./Button.css"

function Button( { textValue, type, clickHandler, filledStatus } ) {

    return (
        <button type={type}
                onClick={ clickHandler }
                className={ filledStatus ? "btn-confirmation btn-filled" : "btn-confirmation btn-clear" }
        >{ textValue }</button>
    );
}

export default Button;