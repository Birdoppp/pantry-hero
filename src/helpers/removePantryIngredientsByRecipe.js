import { db } from "../features/Database/db";
import {adjustIngredientUnit} from "../features/API/Spoonacular";

export async function removePantryIngredientsByRecipe( recipe ) {
    async function queryDatabaseForIngredient( ingredient ) {
        const matchingIngredients = await db.pantry
            .where( "name" )
            .equals( ingredient.name )
            .sortBy("expiryDate")

        let ingredientAmount = ingredient.amount;

        for ( const matchingIngredient of matchingIngredients ) {
            if ( ingredientAmount > 0 ) {
                if ( matchingIngredient.unit === ingredient.unit ) {
                    if ( matchingIngredient.amount > ingredientAmount ) {
                        db.pantry.update(matchingIngredient.id, { amount: matchingIngredient.amount - ingredientAmount });
                    } else {
                        ingredientAmount -= matchingIngredient.amount;
                        db.pantry.delete( matchingIngredient.id );
                    }
                } else {
                    const adjustedIngredientAmount = await adjustIngredientUnit( ingredient, matchingIngredient.unit );

                    if ( matchingIngredient.amount > adjustedIngredientAmount ) {
                        db.pantry.update(matchingIngredient.id, { amount: matchingIngredient.amount - adjustedIngredientAmount });
                    } else {
                        const amountToBeRemoved = await adjustedIngredientAmount( matchingIngredient, ingredient.unit )

                        ingredientAmount -= amountToBeRemoved;
                        db.pantry.delete( matchingIngredient.id );
                    }
                }
            }
        }
    }


    await Promise.all( recipe.ingredients.map( queryDatabaseForIngredient ) );
}