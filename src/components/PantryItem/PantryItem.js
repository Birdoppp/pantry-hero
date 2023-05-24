import React from "react";
import "./PantryItem.css";
import {db} from "../../features/Database/db";
import ConfirmationPopup from "../ConfirmationPopup/ConfirmationPopup";

/* Images */
import {ReactComponent as IconAddToList} from "../../assets/icon-add_to_list.svg";
import {ReactComponent as IconRemoveFromPantry} from "../../assets/icon-delete.svg";
import {ReactComponent as IconExpiryInformation} from "../../assets/icon-expiry.svg";
import {ReactComponent as IconReduceAmount} from "../../assets/icon-reduce.svg";
import {ReactComponent as IconIncreaseAmount} from "../../assets/icon-add.svg";

function PantryItem ( { ingredient } ) {
    const expiry = ingredient.getExpiry();
    const [amount, setAmount] = React.useState(ingredient.getAmount());
    const [ showPopup, setShowPopup ] = React.useState(false);

    let expiryClass = "expiry-information";

    if ( expiry ) {
        if ( expiry > 3 ) {
            expiryClass += " expiry-green";
        } else if ( expiry > 0 ) {
            expiryClass += " expiry-orange";
        } else {
            expiryClass += " expiry-red";
        }
    } else {
        expiryClass += " no-expiry"
    }

    function handleConfirmation( bool ) {
        if (bool) {
            db.pantry.delete(ingredient.id);
            setShowPopup(false);
        } else {
            setShowPopup(false);
        }
    }

    return (
        <article className="pantry-item">
            <div className="pantry-image-container">
                <img src={ ingredient.ImagePath } alt={ ingredient.Name }/>

                <nav className="ingredient-options">
                    <button
                        type="button"
                        onClick={ () => {
                            console.log("Clicked add to list");
                        }
                    }>
                        <IconAddToList className="pantry-item-icon"/>
                    </button>

                    <button
                        type="button"
                        onClick={ () => {
                            setShowPopup(true);
                        }
                    }>
                        <IconRemoveFromPantry className="pantry-item-icon"/>
                    </button>
                </nav>
            </div>

            <div className="item-title">
                <p>{ ingredient.Name.charAt(0).toUpperCase() + ingredient.Name.slice(1) }</p>
            </div>

            <div className="pantry-ingredient-information">
                <div className={expiryClass}>
                    <span><IconExpiryInformation id="icon-expiry"/></span>
                    { expiry ? <span>{ expiry } { expiry === 1 ? "day" : "days" }</span> : <span>no expiry</span> }
                </div>

                <div id="amount-information">
                    <button
                        className="adjust-button"
                        type="button"
                        id="btn-reduce-amount"
                        onClick={() => {
                            ingredient.setAmount(amount - 1);
                            setAmount( (amount - 1) );
                            db.pantry.update(ingredient.id, {amount: amount - 1});
                        }}
                    >
                        <IconReduceAmount className="adjust-button" />
                    </button>

                    <input
                        type="number"
                        value={ amount }
                        onChange={( e) => {
                            ingredient.setAmount(e.target.valueAsNumber);
                            setAmount(e.target.valueAsNumber);
                            db.pantry.update(ingredient.id, {amount: e.target.valueAsNumber});
                        }}
                    />

                    <p>{ingredient.Unit}</p>

                    <button
                        className="adjust-button"
                        type="button"
                        id="btn-increase-amount"
                        onClick={() => {
                            ingredient.setAmount(amount + 1);
                            setAmount( (amount + 1) );
                            db.pantry.update(ingredient.id, {amount: amount + 1});
                        }}
                    >
                        <IconIncreaseAmount className="adjust-button" />
                    </button>
                </div>

                {showPopup && (
                    <ConfirmationPopup message={`Are you sure you want to delete ${ingredient.Name} from your list?`}
                                       onConfirm={ () => {
                                           handleConfirmation(true);
                                       }}
                                       onCancel={ () => {
                                           handleConfirmation(false);
                                       } }
                    />
                )}

            </div>
        </article>
    )
}

export default PantryItem;