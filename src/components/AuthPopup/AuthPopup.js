import React from "react";

// COMPONENTS
import Button from "../Button/Button";

// STYLES
import "./AuthPopup.css"

function AuthPopup ({ children, onConfirm, onCancel } ) {

    return (
        <div className="popup-container">
            <div className="auth-popup">

                <div className="content">{ children }</div>

                <div className="buttons">
                    <Button
                        textValue="Cancel"
                        type="button"
                        clickHandler={ onCancel }
                        filledStatus={ false }
                        color="black"
                    />
                    <Button
                        textValue="Confirm"
                        type="submit"
                        clickHandler={ onConfirm }
                        filledStatus={ true }
                        color="black"
                    />
                </div>
            </div>
        </div>
    );
}

export default AuthPopup;