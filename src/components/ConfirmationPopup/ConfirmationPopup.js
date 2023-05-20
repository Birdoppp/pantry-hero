import React from "react";
import "./ConformationPopup.css"

function ConfirmationPopup ( {message, onConfirm, onCancel } ) {
    return (
        <div className="popup-container">
            <div className="popup">
                <p>{message}</p>
                <div className="buttons">
                    <button id="btn-cancel"
                            onClick={onCancel}
                    >Cancel</button>
                    <button id="btn-confirm"
                            onClick={onConfirm}
                    >Confirm</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationPopup;