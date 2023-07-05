import React, { useEffect, useState } from 'react';
import RecipePopup from "../RecipePopup/RecipePopup";
import { getRequiredIngredients } from "../../helpers/getRequiredIngredients";
import { matchRecipeToPantry } from "../../helpers/matchRecipeToPantry";
import { db } from "../../features/Database/db";

import { ReactComponent as IconPrepTime } from "../../assets/icon-prep_time.svg"
import { ReactComponent as IconIngredientsInfo } from "../../assets/icon-checklist.svg";
import { ReactComponent as IconServingInfo } from "../../assets/icon-servings.svg";
import "./RecipeCard.css"

function RecipeCard({ recipe }) {
    const { image, title, readyInMinutes, servings } = recipe
    const [ matchingIngredientsCount, setMatchingIngredientsCount ] = useState( 0 );
    const [ showFullRecipe, setShowFullRecipe ] = useState(false);

    useEffect( () => {
        matchRecipeToPantry( recipe, db ).then( ( matchingIngredientsNum ) => {
            setMatchingIngredientsCount( matchingIngredientsNum );
        } )
    }, [db.pantry, recipe]);

    return (
        <>
            <article
                className="recipe-card"
                onClick={ () => {
                    //setShowFullRecipe( true );

                    console.log(recipe)
                }}
            >
                <div className="recipe-image-container">
                    <img src={ image } alt={ title } />
                </div>

                <div className="recipe-card-information">
                    <h4>{ title }</h4>

                    <div id="recipe-data">
                        <div className="recipe-data-block">
                            <IconPrepTime/>
                            <div>{ readyInMinutes } min</div>
                        </div>

                        <div className="recipe-data-block">
                            <IconIngredientsInfo/>
                            <div>{ `${ matchingIngredientsCount }/${ getRequiredIngredients( recipe ).length } ingredients` }</div>
                        </div>

                        <div className="recipe-data-block">
                            <IconServingInfo/>
                            <div>{ servings }</div>
                        </div>
                    </div>
                </div>
            </article>

            { showFullRecipe && <RecipePopup
                recipe={ recipe }
                onClose={ () => setShowFullRecipe( false ) }
            /> }
        </>
    );
}

export default RecipeCard;