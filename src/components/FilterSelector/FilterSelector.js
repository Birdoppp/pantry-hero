import React, {useState} from 'react';
import "./FilterSelector.css"

function FilterSelector( { children } ) {
    const [highlightedButton, setHighlightedButton] = useState(null);

    const handleButtonClick = (button) => {
        setHighlightedButton(button);
    };

    return (
        <div className="button-group">
            {React.Children.map(children, (child, index) => {
                const isHighlighted = child === highlightedButton;
                //const childClickHandler = () => { child.props.onClick() }

                return React.cloneElement(child, {
                    key: index,
                    className: `button ${isHighlighted ? "highlighted" : ""}`,
                    onClick: () =>  {
                        console.log("clicked")
                        handleButtonClick(child)
                    },
                });
            })}
        </div>
    );
}

export default FilterSelector;