import { adjustIngredientUnit } from "../features/API/Spoonacular";
import { getFullIngredientAmount } from "./getFullIngredientAmount";

export async function matchRecipeListToPantry( list, database ) {
    const matchingIngredientsList = [];
    const unMatchingIngredientList = [];

    async function queryDatabaseForIngredient( ingredient ) {
        const matchingIngredients = await database.pantry
            .where( "name" )
            .equals( ingredient.name )
            .toArray();

        let tmpIngredient = {};

        if ( matchingIngredients.length > 0 ) {
            const matchingIngredient = matchingIngredients[0];

            if (matchingIngredient.unit !== ingredient.unit ) {
                const amount = await adjustIngredientUnit( ingredient, matchingIngredient.unit );

                tmpIngredient = {
                    ...ingredient,
                    amount: amount,
                    unit: matchingIngredient.unit,
                };
            } else {
                tmpIngredient = ingredient;
            }

            if ( await getFullIngredientAmount( matchingIngredients ) >= ingredient.amount ) {
                matchingIngredientsList.push( tmpIngredient );
            }
        } else {
            unMatchingIngredientList.push( ingredient )
        }
    }

    await Promise.all( list.map( queryDatabaseForIngredient ) );

    return {
        matching: matchingIngredientsList,
        unMatching: unMatchingIngredientList
    };
}