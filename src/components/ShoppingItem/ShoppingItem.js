import React from 'react';
import {db} from "../../features/Database/db";
import Checkbox from "../Checkbox/Checkbox";
import "./ShoppingItem.css"
import {ReactComponent as DeleteIcon} from "../../assets/icon-delete.svg";


function ShoppingItem( { listItem } ) {
    const [ amount, setAmount ] = React.useState(listItem.getAmount());
    const [ showPopup, setShowPopup ] = React.useState(false);
    const [ isItemChecked, setIsItemChecked ] = React.useState(false);
    const [ isHovered, setIsHovered ] = React.useState(false)

    // HANDLERS:
    function handleConfirmation( bool ) {
        if (bool) {
            db.shoppinglist.delete(listItem.id);
            setShowPopup(false);
        } else {
            setShowPopup(false);
        }
    }

    function handleCheckboxChange() {
        setIsItemChecked( prev => !prev );
    }

    return (
        <article className={`shopping-item ${isItemChecked? "checked" : ""}`}>
            <div
                id={"shopping-item-name"}
                className={ isItemChecked? "shopping-item-name-checked" : "shopping-item-name-unchecked"}
            >
                 {listItem.Name}
            </div>

            <button
                type="button"
                className="list-item-button hidden-element"
                onClick={ () => {
                    console.log("Clicked delete button")
                }
                }
            >
                <DeleteIcon/>
            </button>

            <div id="shopping-item-amount">
                <span>{amount}</span>
                <span>{listItem.Unit}</span>
            </div>

            <Checkbox
                checked={ isItemChecked }
                clickHandler={ handleCheckboxChange }
                isLarge={ true }
            />
        </article>
    );
}

export default ShoppingItem;