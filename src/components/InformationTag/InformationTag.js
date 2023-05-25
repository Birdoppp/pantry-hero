import React from 'react';
import "./InformationTag.css"

function InformationTag( { title, displayNum, expiryClass } ) {
    const itemClass = "outer-container " + expiryClass;

    return (
        <div className="information-tag">
            <h4> {title} </h4>
            <div
                id="expiry-tile"
                className={ itemClass }
            >
                { displayNum }
            </div>
        </div>
    );
}

export default InformationTag;