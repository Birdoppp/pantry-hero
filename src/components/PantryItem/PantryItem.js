import React from "react";
import "./PantryItem.css";

/* Images */
import {ReactComponent as IconAddToList} from "../../assets/icon-add_to_list.svg";
import {ReactComponent as IconRemoveFromPantry} from "../../assets/icon-delete.svg";
import {ReactComponent as IconExpiryInformation} from "../../assets/icon-expiry.svg";
import {ReactComponent as IconReduceAmount} from "../../assets/icon-reduce.svg";
import {ReactComponent as IconIncreaseAmount} from "../../assets/icon-add.svg";

function PantryItem ( { ingredient } ) {
    const expiry = ingredient.getExpiry();
    const amount = ingredient.getAmount();

    let expiryClass = "expiry-information";

    if ( expiry > 3 ) {
        expiryClass += " expiry-green";
    } else if ( expiry > 0 ) {
        expiryClass += " expiry-orange";
    } else {
        expiryClass += " expiry-red";
    }


    return (
        <article className="pantry-item">
            <div className="pantry-image-container">
                <img src={ ingredient.ImagePath } alt={ ingredient.Name }/>

                <nav className="ingredient-options">
                    <button
                        type="button"
                        onClick={ () => {
                            console.log("Clicked add to list")
                        }
                    }>
                        <IconAddToList className="pantry-item-icon"/>
                    </button>

                    <button
                        type="button"
                        onClick={ () => {
                            console.log("Clicked remove from pantry");
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
                    <span>{ expiry } { expiry === 1 ? "day" : "days" }</span>
                </div>

                <form id="amount-information" onSubmit={ (e) => { e.preventDefault() } }>
                    <button
                        className="adjust-button"
                        type="button"
                        id="btn-reduce-amount"
                        onClick={ () => {
                            ingredient.setAmount(ingredient.getAmount() - 1);
                        }
                    }>
                        <IconReduceAmount
                            className="adjust-button"
                        />
                    </button>

                    <input type="number"
                           value={amount}
                           onChange={ (e) => {
                               ingredient.setAmount(e.target.valueAsNumber);
                           } }
                    />

                    <p>{ ingredient.Unit }</p>

                    <button
                        className="adjust-button"
                        type="button"
                        id="btn-increase-amount"
                        onClick={ () => {
                            ingredient.setAmount(ingredient.getAmount() + 1);
                        }
                    }>
                        <IconIncreaseAmount
                            className="adjust-button"
                        />
                    </button>
                </form>
            </div>
        </article>
    )
}

export default PantryItem;