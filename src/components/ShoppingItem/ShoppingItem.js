import React, {useEffect} from 'react';
import {db} from "../../features/Database/db";
import Checkbox from "../Checkbox/Checkbox";
import "./ShoppingItem.css"
import {ReactComponent as DeleteIcon} from "../../assets/icon-delete.svg";
import Popup from "../Popup/Popup";


function ShoppingItem( { listItem } ) {
    const [ amount, setAmount ] = React.useState(listItem.getAmount());
    const [ showPopup, setShowPopup ] = React.useState(false);
    const [ isItemChecked, setIsItemChecked ] = React.useState(listItem.Checked);

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

    useEffect( () => {
        db.shoppinglist.update(listItem.id, {checked: isItemChecked});
        // db.shoppinglist.toArray().then(data => console.log(data));
    }, [listItem.id, isItemChecked]);

    return (
        <article className={`shopping-item ${isItemChecked? "checked" : ""}`}>
            <div
                id={"shopping-item-name"}
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
                <span>{amount}</span>
                <span>{listItem.Unit}</span>
            </div>

            <Checkbox
                checked={ isItemChecked }
                clickHandler={ handleCheckboxChange }
                isLarge={ true }
            />

            {showPopup && (
                <Popup message={`Are you sure you want to delete ${listItem.Name} from your list?`}
                       onConfirm={ () => {
                                       handleConfirmation(true);
                                   }}
                       onCancel={ () => {
                                       handleConfirmation(false);
                                   } }
                >
                    <p>Are you sure you want to delete {listItem.Name} from your list?</p>
                </Popup>
            )}
        </article>
    );
}

export default ShoppingItem;