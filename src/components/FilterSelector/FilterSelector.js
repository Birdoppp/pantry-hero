import React, { useState } from 'react';

// STYLES
import './FilterSelector.css';

function FilterSelector({ children }) {
    const [ highlightedButtonIndex, setHighlightedButtonIndex ] = useState(0);

    // HANDLERS
    function handleButtonClick ( buttonIndex )  {
        setHighlightedButtonIndex( buttonIndex );

        children[ buttonIndex ].props.onClick();
    }

    return (
        <div className="button-group">
            { React.Children.map( children, ( child, index ) => {
                const isHighlighted = index === highlightedButtonIndex;
                const childClickHandler = () => {
                    handleButtonClick( index );
                };

                return (
                    <button
                        key={`selector-button-${ index }`}
                        className={`button ${ isHighlighted ? "highlighted" : "" }`}
                        onClick={ childClickHandler }
                    >
                        { child.props.children }
                    </button>
                );
            } ) }
        </div>
    );
}

export default FilterSelector;