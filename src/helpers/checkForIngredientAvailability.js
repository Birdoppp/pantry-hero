import { db } from "../features/Database/db";
import { getFullIngredientAmount } from "./getFullIngredientAmount";

export async function checkForIngredientAvailability( ingredient ) {
    const matchingIngredients = await db.pantry
        .where("name")
        .equals(ingredient.name)
        .toArray();

    if ( matchingIngredients.length > 0 ) {
        const fullAmount = await getFullIngredientAmount( matchingIngredients );

        return fullAmount >= ingredient.amount;
    } else {
        return false
    }
}