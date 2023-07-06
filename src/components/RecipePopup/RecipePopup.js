import React from 'react';
import RecipeSubtitle from "../RecipeSubtitle/RecipeSubtitle";
import IngredientStatusBlock from "../IngredientStatusBlock/IngredientStatusBlock";
import { findObjectByName } from "../../helpers/findObjectByName";
import { checkForIngredientAvailability } from "../../helpers/checkForIngredientAvailability";
import { ReactComponent as IconReturn } from "../../assets/icon-arrow_back.svg";
import { ReactComponent as IconPrepTime } from "../../assets/icon-prep_time.svg";
import { ReactComponent as IconServings } from "../../assets/icon-servings.svg";
import { ReactComponent as IconCalories } from "../../assets/icon-calories.svg";
import "./RecipePopup.css";
import Button from "../Button/Button";

function RecipePopup({ recipe, onClose, ingredientAmount }) {
    const { image, title, readyInMinutes, servings, nutrition:{ nutrients }, ingredients, analyzedInstructions } = recipe;
    const steps = analyzedInstructions[0].steps;

    ingredients.forEach( ( ingredient ) => {
        void checkForIngredientAvailability(ingredient)
    } )

    function handleAddRecipeToSelection() {
        const existingData = localStorage.getItem("recipeSelection");
        const recipeSelection = existingData ? JSON.parse(existingData) : [];

        if ( recipeSelection.length === 3 ) {
            recipeSelection.shift();
        }

        if ( recipeSelection.some( item => item.id === recipe.id ) ) {
            onClose();
            return;
        }

        recipeSelection.push( recipe );
        localStorage.setItem("recipeSelection", JSON.stringify(recipeSelection));
        onClose();
    }

    return (
        <div className="popup-container">
            <div id="recipe-popup">
                <div id="image-container">
                    <img src={ image } alt={ title } />
                    <button
                        type="button"
                        className="return-button"
                        onClick={ onClose }
                    ><IconReturn/></button>
                </div>

                <article id="recipe">
                    <h2>{ title }</h2>

                    <div id="recipe-information-tiles">
                        <div id="recipe-data">
                            <div className="recipe-data-block">
                                <IconPrepTime/>
                                <div>{ readyInMinutes } min</div>
                            </div>

                            <div className="recipe-data-block right-aligned">
                                <IconServings/>
                                <div>{ servings }</div>
                            </div>
                        </div>

                        <div id="recipe-data">
                            <div className="recipe-data-block">
                                <IconCalories/>
                                <div>{ Math.round( findObjectByName( nutrients, "Calories" ).amount ) }</div>
                            </div>
                        </div>
                    </div>

                    <RecipeSubtitle>
                        <h3>Ingredients</h3>
                        <h4>{ ingredientAmount }</h4>
                    </RecipeSubtitle>

                    <div id="recipe-ingredients-overview">
                        { ingredients.length > 0 &&
                            ingredients.map( (ingredient, index) => (
                                <IngredientStatusBlock key={`ingredient-${index}`} ingredient={ ingredient }/>
                            ))
                        }
                    </div>

                    <RecipeSubtitle>
                        <h3>Steps</h3>
                    </RecipeSubtitle>

                    <div id="recipe-steps-overview">
                        { steps.length > 0 &&
                            steps.map( (step) => (
                                <div className="recipe-step" key={ step.number }>
                                    <h4>Step { step.number }: </h4>
                                    <p>{step.step}</p>
                                </div>
                            ))
                        }
                    </div>
                </article>

                <Button
                    id={ "btn-add-to-recipes" }
                    textValue="Add to my selection"
                    type="button"
                    filledStatus={ true }
                    clickHandler={ handleAddRecipeToSelection }
                />
            </div>
        </div>
    );
}

export default RecipePopup;