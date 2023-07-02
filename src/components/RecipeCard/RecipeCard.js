import React, {useEffect, useState } from 'react';
import { getRecipeIngredientsList } from "../../helpers/getRecipeIngredientsList";
import { db } from "../../features/Database/db";
import { ReactComponent as IconPrepTime } from "../../assets/icon-prep_time.svg"
import { ReactComponent as IconIngredientsInfo } from "../../assets/icon-checklist.svg";
import { ReactComponent as IconServingInfo } from "../../assets/icon-servings.svg";
import "./RecipeCard.css"

function RecipeCard({ recipe }) {
    const { image, title, readyInMinutes, servings } = recipe
    const [ matchingIngredientsCount, setMatchingIngredientsCount ] = useState( 0 );

    useEffect(() => {
        async function fetchMatchingIngredients() {
            try {
                const objects = await db.pantry
                    .where( "name" )
                    .anyOfIgnoreCase( getRecipeIngredientsList( recipe ) )
                    .toArray();

                const uniqueObjects = objects.filter(
                    (object, index, self) => self.findIndex(obj => obj.name === object.name) === index
                );

                setMatchingIngredientsCount(uniqueObjects.length);
            } catch (error) {
                console.error('Error:', error);
            }
        }

        void fetchMatchingIngredients();
    }, [ recipe ]);

    return (
        <article
            className="recipe-card"
            onClick={ () => console.log( recipe ) }
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
                        <div>{ `${ matchingIngredientsCount }/${ getRecipeIngredientsList( recipe ).length } ingredients` }</div>
                    </div>

                    <div className="recipe-data-block">
                        <IconServingInfo/>
                        <div>{ servings }</div>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default RecipeCard;