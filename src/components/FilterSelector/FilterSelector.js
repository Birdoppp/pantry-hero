import React, { useState, useEffect } from 'react';
import "./FilterSelector.css"

function FilterSelector({ children }) {
    const [highlightedButtonIndex, setHighlightedButtonIndex] = useState(0);

    const handleButtonClick = (buttonIndex) => {
        setHighlightedButtonIndex(buttonIndex);

        setTimeout(() => {
            children[buttonIndex].props.onClick();
        }, 0);
    };

    return (
        <div className="button-group">
            {React.Children.map(children, (child, index) => {
                const isHighlighted = index === highlightedButtonIndex;
                const childClickHandler = () => {
                    handleButtonClick(index);
                };

                return (
                    <button
                        key={index}
                        className={`button ${isHighlighted ? "highlighted" : ""}`}
                        onClick={childClickHandler}
                    >
                        {child.props.children}
                    </button>
                );
            })}
        </div>
    );
}

export default FilterSelector;