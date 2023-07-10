import React, { useEffect } from 'react';

// DEPENDENCIES
import { db } from "../../features/Database/db";

// COMPONENTS
import Popup from "../Popup/Popup";
import Checkbox from "../Checkbox/Checkbox";

// HELPERS
import { handleConfirmation } from "../../helpers/handleConfirmation";

// IMAGES
import { ReactComponent as DeleteIcon } from "../../assets/icon-delete.svg";

// STYLES
import "./ShoppingItem.css"

function ShoppingItem( { listItem } ) {
    const [ amount, setAmount ] = React.useState( listItem.getAmount() ); // setAmount for future editing of shopping list items purpose
    const [ showPopup, setShowPopup ] = React.useState(false);
    const [ isItemChecked, setIsItemChecked ] = React.useState(listItem.Checked);

    // USE EFFECTS
    useEffect( () => {
        db.shoppinglist.update(listItem.id, {checked: isItemChecked});
    }, [listItem.id, isItemChecked]);

    // HANDLERS
    function handleCheckboxChange() {
        setIsItemChecked( prev => !prev );
    }

    function handleDeleteFromShoppinglist() {
        db.shoppinglist.delete(listItem.id);
    }

    return (
        <article className={ `shopping-item ${isItemChecked? "checked" : ""}` }>
            <div className="shopping-item-information">
                <div
                    id="shopping-item-name"
                    className={ isItemChecked? "shopping-item-name-checked" : "shopping-item-name-unchecked"}
                >
                    <p>{ listItem.Name.charAt(0).toUpperCase() + listItem.Name.slice(1) }</p>
                </div>

                <div id="shopping-item-buttons">
                    <button
                        type="button"
                        className="list-item-button hidden-element"
                        onClick={ () => {
                            setShowPopup( true );
                        }
                        }
                    >
                        <DeleteIcon/>
                    </button>
                </div>


                <div id="shopping-item-amount">
                    <span>{ amount }</span>
                    <span>{ listItem.Unit }</span>
                </div>
            </div>

            <Checkbox
                checked={ isItemChecked }
                clickHandler={ handleCheckboxChange }
                isLarge={ true }
            />

            {showPopup && (
                <Popup message={ `Are you sure you want to delete ${ listItem.Name } from your list?` }
                       onConfirm={ () => {
                           handleConfirmation( true, setShowPopup, handleDeleteFromShoppinglist );
                       }}
                       onCancel={ () => {
                           handleConfirmation(false, setShowPopup );
                       } }
                >
                    <p>Are you sure you want to delete { listItem.Name } from your list?</p>
                </Popup>
            )}
        </article>
    );
}

export default ShoppingItem;