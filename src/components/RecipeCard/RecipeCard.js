import React, { useEffect, useState } from 'react';

// DEPENDENCIES
import { db } from "../../features/Database/db";

// COMPONENTS
import RecipePopup from "../RecipePopup/RecipePopup";

// HELPERS
import { matchRecipeToPantry } from "../../helpers/matchRecipeToPantry";

// IMAGES
import { ReactComponent as IconPrepTime } from "../../assets/icon-prep_time.svg"
import { ReactComponent as IconIngredientsInfo } from "../../assets/icon-checklist.svg";
import { ReactComponent as IconServingInfo } from "../../assets/icon-servings.svg";

// STYLES
import "./RecipeCard.css"

function RecipeCard({ recipe, isSelection, storage }) {
    const { image, title, readyInMinutes, servings } = recipe
    const [ matchingIngredientsCount, setMatchingIngredientsCount ] = useState( 0 );
    const [ showFullRecipe, setShowFullRecipe ] = useState(false);
    const [ ingredientAmountString, setIngredientAmountString ] = useState("");

    // USE EFFECTS
    useEffect(() => {
        async function updateMatchingIngredients() {
            const matchingIngredientsNum = await matchRecipeToPantry(recipe, db, storage);
            setMatchingIngredientsCount(matchingIngredientsNum);
        }

        void updateMatchingIngredients();
    }, [recipe, storage]);

    useEffect(() => {
        function getIngredientAmountString() {
            let totalIngredients = 0;

            if (recipe.ingredients !== undefined && recipe.ingredients !== null) {
                totalIngredients = recipe.ingredients.length;
            }

            return `${matchingIngredientsCount}/${totalIngredients}`;
        }

        setIngredientAmountString(getIngredientAmountString());
    }, [recipe.ingredients, matchingIngredientsCount]);

    return (
        <>
            <article
                className="recipe-card"
                onClick={ () => {
                    setShowFullRecipe( true );
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
                            <div>{ `${ ingredientAmountString } ingredients` }</div>
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
                ingredientAmount={ ingredientAmountString }
                isSelection={ isSelection }
            /> }
        </>
    );
}

export default RecipeCard;