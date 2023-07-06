import React, { useEffect, useState } from 'react';
import { checkForIngredientAvailability } from "../../helpers/checkForIngredientAvailability";
import { ReactComponent as IconUnavailable } from "../../assets/icon-cross.svg";
import { ReactComponent as IconAvailable } from "../../assets/icon-check-black.svg"
import "./IngredientStatusBlock.css"
import {formatUnitString} from "../../helpers/formatUnitString";

function IngredientStatusBlock({ ingredient }) {
    const [ isAvailable, setIsAvailable ] = useState( false );

    useEffect( () => {
        async function checkAvailability() {
            const availability = await checkForIngredientAvailability( ingredient );

            setIsAvailable( availability );
        }

        void checkAvailability();
    })

    return (
        <div id="ingredient-status-block">
            { isAvailable ? (
                <IconAvailable/>
            ) : (
                <IconUnavailable/>
            ) }

            <div className="ingredient-status-text">
                <p>{ ingredient.name }</p>
                <p>{`${ ingredient.amount } ${ formatUnitString( ingredient.unit ) }`}</p>
            </div>

        </div>
    );
}

export default IngredientStatusBlock;