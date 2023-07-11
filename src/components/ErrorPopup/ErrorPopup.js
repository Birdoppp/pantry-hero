import React from "react";

// COMPONENTS
import Button from "../Button/Button";

// STYLES
import "./ErrorPopup.css"

function ErrorPopup ({ children, onConfirm }) {

    return (
        <div className="popup-container">
            <div className="error-popup">
                <p><b>ERROR:</b></p>

                <div className="content">{ children }</div>

                <div className="buttons">
                    <Button
                        textValue="Ok"
                        type="button"
                        clickHandler={ onConfirm }
                        filledStatus={ true }
                    />
                </div>
            </div>
        </div>
    );
}

export default ErrorPopup;