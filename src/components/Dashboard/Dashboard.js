import React from 'react';
import "./Dashboard.css";

function Dashboard( { children } ) {
    const childElements = Array.isArray(children) ? children : [children];

    return (
        <div className="dashboard">
            { childElements.map(( child, index ) => {
                return (
                <React.Fragment key={ index }>
                    { child }
                    { index !== childElements.length - 1 && React.isValidElement(child) && child.props.hasOwnProperty('children') && <div className="divider"></div>}
                </React.Fragment>
            )
            } ) }
        </div>
    );
}

export default Dashboard;