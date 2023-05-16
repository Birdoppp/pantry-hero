import React from "react";
import "./PantryItem.css";

/* Images */
import {ReactComponent as IconAddToList} from "../../assets/icon-add_to_list.svg";
import {ReactComponent as IconRemoveFromPantry} from "../../assets/icon-delete.svg";
import {ReactComponent as IconExpiryInformation} from "../../assets/icon-expiry.svg";
import {ReactComponent as IconReduceAmount} from "../../assets/icon-reduce.svg";
import {ReactComponent as IconIncreaseAmount} from "../../assets/icon-add.svg";

function PantryItem ( {ingredient, index} ) {
    const expiry = ingredient.getExpiry();
    const amount = ingredient.getAmount();


    return (
        <article className="pantry-item">
            <div className="pantry-image-container">
                <img src={ ingredient.ImagePath } alt={ ingredient.Name }/>

                <nav className="ingredient-options">
                    <button onClick={ () => {
                        console.log("Clicked add to list")
                    } }>
                        <IconAddToList className="pantry-item-icon"/>
                    </button>

                    <button onClick={ () => {
                        console.log("Clicked remove from pantry");
                    } }>
                        <IconRemoveFromPantry className="pantry-item-icon"/>
                    </button>
                </nav>
            </div>

            <div className="item-title">
                <p>{ ingredient.Name.charAt(0).toUpperCase() + ingredient.Name.slice(1) }</p>
            </div>

            <div className="pantry-ingredient-information">
                <div id="expiry-information">
                    <span><IconExpiryInformation id="icon-expiry"/></span>
                    <span>{ expiry } days</span>
                </div>

                <form id="amount-information" onSubmit={ (e) => { e.preventDefault() } }>
                    <button
                        className="adjust-button"
                        id="btn-reduce-amount"
                        onClick={ () => {
                        ingredient.setAmount(ingredient.getAmount() - 1);
                    } }>
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
                        id="btn-increase-amount"
                        onClick={ () => {
                        ingredient.setAmount(ingredient.getAmount() + 1);
                    } }>
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