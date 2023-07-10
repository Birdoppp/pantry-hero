import React, {useContext, useState} from 'react';

// COMPONENTS
import Button from "../Button/Button";
import Popup from "../Popup/Popup";

// CONTEXT
import { AuthContext } from "../../context/AuthProvider";

// STYLES
import "./HamburgerMenu.css"


function HamburgerMenu() {
    const { user, logout } = useContext(AuthContext)
    const [ isOpen, setIsOpen ] = useState(false);
    const [ showPopout, setShowPopout ] = useState( false);
    const [ showConfirmationPopup, setShowConfirmationPopup ] = useState(false);

    // HANDLERS
    function handleClick() {
        if ( isOpen ) {
            setShowPopout( false );
            function closeMenu() {
                setIsOpen(false);
            }

            setTimeout( closeMenu, 200 );
        } else {
            setShowPopout( true );
            setIsOpen( true );
        }
    }

    function handleLogoutConfirm() {
        setShowConfirmationPopup( false );
        logout();
    }

    return (
        <>
            <div className={`menu ${ isOpen ? "open" : "" }`}
                 onClick={ handleClick }
            >
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </div>

            { isOpen &&
                <div className={`hamburger-popout ${showPopout ? "hamburger-popout-open" : "hamburger-popout-closed" }`}>
                    <h3>{ user.username }</h3>
                    <p>What do you wish to do?</p>
                    <Button
                        textValue="Log out"
                        type="button"
                        clickHandler={ () => setShowConfirmationPopup( true ) }
                        filledStatus={ true }
                        color="black"
                    />
                </div>
            }

            { showConfirmationPopup && (
                <Popup
                    onConfirm={ handleLogoutConfirm }
                    onCancel={ () => setShowConfirmationPopup( false ) }
                >
                    <h2>Logging out</h2>
                    <p>Are you sure you want to log out?</p>
                </Popup>
            )}
        </>
    );
}

export default HamburgerMenu;