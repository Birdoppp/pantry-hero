import React, { Fragment, useState } from 'react';
import "./Dashboard.css";
import { ReactComponent as ArrowDown } from "../../assets/icon-arrow_down.svg";
import { ReactComponent as ArrowUp } from "../../assets/icon-arrow_up.svg";

function Dashboard({ children }) {
    const childElements = Array.isArray( children ) ? children : [ children ];
    const [ isVisible, setIsVisible ] = useState(true);

    function handleToggleVisibility() {
        setIsVisible( !isVisible );
    }

    return (
        <div className="dashboard">

            <button
                className="btn-toggle-visibility"
                onClick={ handleToggleVisibility }
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