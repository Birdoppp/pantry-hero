import React from 'react';
import "./Dashboard.css";

function Dashboard( { children } ) {
    return (
        <div className="dashboard">
            { children.map(( child, index ) => {
                return (
                <React.Fragment key={ index }>
                    { child }
                    { index !== children.length - 1 &&  <div className="divider"></div>}
                </React.Fragment>
            )
            } ) }
        </div>
    );
}

export default Dashboard;