import React, { Fragment, useState } from 'react';

// IMAGES
import { ReactComponent as ArrowDown } from "../../assets/icon-arrow_down.svg";
import { ReactComponent as ArrowUp } from "../../assets/icon-arrow_up.svg";

// STYLES
import "./Dashboard.css";

function Dashboard({ children }) {
    const childElements = Array.isArray( children ) ? children : [ children ];
    const [ isVisible, setIsVisible ] = useState(true);

    // HANDLERS
    function handleToggleVisibility() {
        setIsVisible( prev => !prev );
    }

    return (
        <div className="dashboard">

            <button
                type="button"
                className="btn-toggle-visibility"
                onClick={ e => handleToggleVisibility( e ) }
            >
                { isVisible ?
                    <ArrowUp className="btn-toggle-visibility"/> :
                    <ArrowDown className="btn-toggle-visibility"/>
                }
            </button>

            { isVisible && childElements.map(( child, index ) => (
                <Fragment key={ `dashboard-item-${ index }` }>
                    { child }
                    { index !== childElements.length - 1 &&
                        React.isValidElement( child ) &&
                        child.props.hasOwnProperty("children") && (
                            <div className="divider"></div>
                        ) }
                </Fragment>
            ))}
        </div>
    );
}

export default Dashboard;