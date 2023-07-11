import React, { useEffect, useState } from "react";

// HELPERS
import { checkForIngredientAvailability } from "../../helpers/checkForIngredientAvailability";
import { formatUnitString } from "../../helpers/formatUnitString";
import { formatAmount } from "../../helpers/formatAmount";

// IMAGES
import { ReactComponent as IconListItem } from "../../assets/icon-not_on_list.svg";
import { ReactComponent as IconUnavailable } from "../../assets/icon-cross.svg";
import { ReactComponent as IconAvailable } from "../../assets/icon-check-black.svg"

// STYLES
import "./IngredientStatusBlock.css"

function IngredientStatusBlock({ ingredient, isListItem }) {
    const [ isAvailable, setIsAvailable ] = useState( false );

    // USE EFFECTS
    useEffect( () => {
        async function checkAvailability() {
            const availability = await checkForIngredientAvailability( ingredient );

            setIsAvailable( availability );
        }

        void checkAvailability();
    });

    return (
        <div id="ingredient-status-block">
            { isListItem ? (
                <IconListItem/>
            ) : (
                isAvailable ? (
                    <IconAvailable/>
                ) : (
                    <IconUnavailable/>
                )
            )}

            <div className="ingredient-status-text">
                <p>{ ingredient.name }</p>
                <p>{`${ formatAmount(ingredient.amount) } ${ formatUnitString( ingredient.unit ) }`}</p>
            </div>

        </div>
    );
}

export default IngredientStatusBlock;