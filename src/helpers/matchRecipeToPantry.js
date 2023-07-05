import { adjustIngredientUnit } from "../features/API/Spoonacular";
import { getRequiredIngredients } from "./getRequiredIngredients";
import { adjustRecipeById } from "./adjustRecipeById";

export async function matchRecipeToPantry( recipe, database ) {
    const originalIngredientsList = recipe["ingredients"] ? recipe["ingredients"] : getRequiredIngredients( recipe );
    const adjustedIngredientsList = [];
    let matchingIngredientsAmount = 0;

    async function queryDatabaseForIngredient( ingredient ) {
        const matchingIngredients = await database.pantry
            .where( "name" )
            .equals( ingredient.name )
            .toArray();

        if ( matchingIngredients.length > 0 ) {
            const matchingIngredient = matchingIngredients[0];

            if (matchingIngredient.unit !== ingredient.unit ) {
                await adjustIngredientUnit( ingredient, matchingIngredient.unit ).then( (amount) => {
                    const adjustedIngredient = {
                        ...ingredient,
                        amount,
                        unit: matchingIngredient.unit,
                    };

                    adjustedIngredientsList.push( adjustedIngredient );
                });
            }

            matchingIngredientsAmount++;
        } else {
            adjustedIngredientsList.push( ingredient );
        }
    }

    await Promise.all( originalIngredientsList.map( queryDatabaseForIngredient ) );
    recipe["ingredients"] = adjustedIngredientsList;
    adjustRecipeById( recipe );

    return matchingIngredientsAmount;
}