import React from "react";
import "./ConformationPopup.css"
import Button from "../Button/Button";

function ConfirmationPopup ( {message, onConfirm, onCancel } ) {
    return (
        <div className="popup-container">
            <div className="popup">
                <p>{message}</p>
                <div className="buttons">
                    <Button
                        textValue="Cancel"
                        type="button"
                        clickHandler={ onCancel }
                        filledStatus={ false }
                    />
                    <Button
                        textValue="Confirm"
                        type="button"
                        clickHandler={ onConfirm }
                        filledStatus={ true }
                    />
                </div>
            </div>
        </div>
    );
}

export default ConfirmationPopup;