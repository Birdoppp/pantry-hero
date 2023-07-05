import React, {useEffect, useState} from 'react';
import RecipePopup from "../RecipePopup/RecipePopup";
import {matchRecipeToPantry} from "../../helpers/matchRecipeToPantry";
import {db} from "../../features/Database/db";

import {ReactComponent as IconPrepTime} from "../../assets/icon-prep_time.svg"
import {ReactComponent as IconIngredientsInfo} from "../../assets/icon-checklist.svg";
import {ReactComponent as IconServingInfo} from "../../assets/icon-servings.svg";
import "./RecipeCard.css"

function RecipeCard({ recipe }) {
    const { image, title, readyInMinutes, servings } = recipe
    const [ matchingIngredientsCount, setMatchingIngredientsCount ] = useState( 0 );
    const [ showFullRecipe, setShowFullRecipe ] = useState(false);
    const [ ingredientAmountString, setIngredientAmountString ] = useState("");

    useEffect( () => {
         matchRecipeToPantry( recipe, db ).then( ( matchingIngredientsNum ) => {
            setMatchingIngredientsCount( matchingIngredientsNum );
        } )
    });

    useEffect( () => {
        function getIngredientAmountString() {
            const totalIngredients = recipe.ingredients.length;

            return `${matchingIngredientsCount}/${totalIngredients} ingredients`;
        }

        setIngredientAmountString( getIngredientAmountString );
    }, [matchingIngredientsCount])

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
                            <div>{ ingredientAmountString }</div>
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