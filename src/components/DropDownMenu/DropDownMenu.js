import React, {Fragment, useState} from 'react';

// IMAGES
import { ReactComponent as ArrowDown } from "../../assets/icon-arrow_down.svg";
import { ReactComponent as ArrowUp } from "../../assets/icon-arrow_up.svg";

// STYLES
import "./DropDownMenu.css"

function DropDownMenu({ title, children }) {
    const childElements = Array.isArray( children ) ? children : [ children ];
    const [ isVisible, setIsVisible ] = useState(false)

    // HANDLERS
    function handleToggleVisibility() {
        setIsVisible( prev => !prev );
    }

    return (
        <div className="drop-down-menu">
            <div id="drop-down-title">
                <h4>{ title }</h4>

                <button
                    type="button"
                    onClick={ handleToggleVisibility }
                >
                    { isVisible ?
                        <ArrowUp className="btn-toggle-dropdown"/> :
                        <ArrowDown className="btn-toggle-dropdown"/>
                    }
                </button>
            </div>
            <div className="underline"></div>

            { isVisible && <div className="dropdown-items">
                { childElements.map(( child, index ) => (
                    <Fragment key={ `dropdown-item-${ index }` }>
                        { child }
                    </Fragment>
                ))}
            </div> }
        </div>
    );
}

export default DropDownMenu;