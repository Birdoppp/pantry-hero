import { adjustIngredientUnit } from "../features/API/Spoonacular";

export async function getFullIngredientAmount( ingredientArray ) {
    let totalAmount = 0;

    for ( const ingredient of ingredientArray ) {
        if ( ingredient.unit !== ingredientArray[0].unit ) {
            const correctedAmount = await adjustIngredientUnit( ingredient, ingredientArray[0].unit )

            totalAmount += correctedAmount;
        } else {
            totalAmount += ingredient.amount;
        }
    }

    return totalAmount;
}