import React, { useState } from "react";

// DEPENDENCIES
import { db } from "../../features/Database/db";

// COMPONENTS
import Popup from "../Popup/Popup";

// HELPERS
import { handleConfirmation } from "../../helpers/handleConfirmation";
import { addItemToShoppingList } from "../../helpers/addItemToShoppingList";

// IMAGES
import { ReactComponent as IconAddToList } from "../../assets/icon-add_to_list.svg";
import { ReactComponent as IconRemoveFromPantry } from "../../assets/icon-delete.svg";
import { ReactComponent as IconExpiryInformation } from "../../assets/icon-expiry.svg";
import { ReactComponent as IconReduceAmount } from "../../assets/icon-reduce.svg";
import { ReactComponent as IconIncreaseAmount } from "../../assets/icon-add.svg";

// STYLES
import "./PantryItem.css";

function PantryItem({ ingredient }) {
    const [ amount, setAmount ] = React.useState(ingredient.getAmount());
    const [ showDeletePopup, setShowDeletePopup ] = useState(false);
    const [ showAddToListPopup, setShowAddToListPopup ] = useState(false);
    const [ addListItemAmount, setAddListItemAmount ] = useState(0);
    const [ listItemUnit, setListItemUnit ] = useState(ingredient.Unit);


    const expiry = ingredient.getExpiry();
    let expiryClass = "expiry-information";

    if (expiry || expiry === 0) {
        if (expiry > 3) {
            expiryClass += " expiry-green";
        } else if (expiry > 0) {
            expiryClass += " expiry-orange";
        } else {
            expiryClass += " expiry-red";
        }
    } else {
        expiryClass += " no-expiry";
    }

    // HANDLERS
    async function handleAddItemToShoppingList() {
        try {
            const thisIngredient = await db.pantry.get( ingredient.id );

            const ingredientExpiresInDays = thisIngredient.ingredientExpiryDays;

            await addItemToShoppingList(
                thisIngredient.name,
                listItemUnit,
                thisIngredient.possibleUnits,
                thisIngredient.type,
                thisIngredient.imagePath,
                addListItemAmount,
                ingredientExpiresInDays,
                false
            );
        } catch ( e ) {
            console.error( e );
        }
    }

    return (
        <article className="pantry-item">
            <div className="pantry-image-container">
                <img src={ ingredient.getImage() } alt={ ingredient.Name } />

                <nav className="ingredient-options">
                    <button
                        type="button"
                        onClick={() => {
                            setShowAddToListPopup(true);
                        }}
                    >
                        <IconAddToList className="pantry-item-icon" />
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setShowDeletePopup(true);
                        }}
                    >
                        <IconRemoveFromPantry className="pantry-item-icon" />
                    </button>
                </nav>
            </div>

            <div className="item-title">
                <p>{ ingredient.Name.charAt(0).toUpperCase() + ingredient.Name.slice(1) }</p>
            </div>

            <div className="pantry-ingredient-information">
                <div className={ expiryClass }>
                    <span>
                        <IconExpiryInformation id="icon-expiry" />
                    </span>

                    { expiry || expiry === 0 ? (
                        <span>
                                {expiry} {expiry === 1 ? "day" : "days"}
                        </span>
                    ) : (
                        <span>no expiry</span>
                    )}
                </div>

                <div id="amount-information">
                    <button
                        className="adjust-button"
                        type="button"
                        id="btn-reduce-amount"
                        onClick={() => {
                            if ( amount > 1 ) {
                                ingredient.setAmount(amount - 1);
                                setAmount(amount - 1);
                                db.pantry.update(ingredient.id, { amount: amount - 1 });
                            } else if ( amount === 1 ) {
                                setShowDeletePopup(true);
                            }
                        }}
                    >
                        <IconReduceAmount className="adjust-button" />
                    </button>

                    <input
                        type="number"
                        value={amount.toString()}
                        onChange={(e) => {
                            if ( e.target.valueAsNumber > 0 ) {
                                ingredient.setAmount(e.target.valueAsNumber);
                                setAmount(e.target.valueAsNumber);
                                db.pantry.update(ingredient.id, { amount: e.target.valueAsNumber });
                            } else if ( e.target.valueAsNumber <= 0 ) {
                                setShowDeletePopup( true );
                            }

                        }}
                    />

                    <p>{ ingredient.Unit }</p>

                    <button
                        className="adjust-button"
                        type="button"
                        id="btn-increase-amount"
                        onClick={() => {
                            ingredient.setAmount(amount + 1);
                            setAmount(amount + 1);
                            db.pantry.update(ingredient.id, { amount: amount + 1 });
                        }}
                    >
                        <IconIncreaseAmount className="adjust-button" />
                    </button>
                </div>

                {showDeletePopup && (
                    <Popup
                        onConfirm={() => {
                            handleConfirmation(true, setShowDeletePopup, () => {
                                db.pantry.delete(ingredient.id);
                            });
                        }}
                        onCancel={() => {
                            handleConfirmation(false, setShowDeletePopup);
                        }}
                    >
                        <p>Are you sure you want to delete { ingredient.Name } from your list?</p>
                    </Popup>
                )}

                {showAddToListPopup && (
                    <Popup
                        onConfirm={() => {
                            handleConfirmation(true, setShowAddToListPopup, handleAddItemToShoppingList);
                        }}
                        onCancel={() => {
                            handleConfirmation(false, setShowAddToListPopup);
                            setAddListItemAmount(0);
                        }}
                    >
                        <p>Set the amount of { ingredient.Name } you want to add to your shopping list:</p>

                        <div id="form-amount-information">
                            <input
                                type="number"
                                id="input-amount"
                                placeholder="amount"
                                onChange={(e) => {
                                    setAddListItemAmount(e.target.valueAsNumber);
                                }}
                            />

                            <select
                                id="input-unit"
                                onChange={(e) => {
                                    setListItemUnit(e.target.value);
                                }}
                                value={listItemUnit.toString()}
                            >
                                {ingredient.PossibleUnits.map((item) => (
                                    <option key={ item } value={ item }>
                                        { item }
                                    </option>
                                ))}
                            </select>
                        </div>
                    </Popup>
                )}
            </div>
        </article>
    );
}

export default PantryItem;