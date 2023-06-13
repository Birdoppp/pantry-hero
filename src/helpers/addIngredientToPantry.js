import { db } from "../features/Database/db";

export async function addIngredientToPantry (name, unit, possibleUnits, type, imagePath, amount, expiryDate ) {
    let ingredientExpiryDays = null;

    if ( expiryDate ) {
        const date = new Date(expiryDate)
        const today = new Date();
        const difference = date.getTime() - today.getTime();

        ingredientExpiryDays = Math.ceil(difference / (1000 * 3600 * 24));
    }

    try{
        const id = await db.pantry.add( {
            name,
            unit,
            possibleUnits,
            type,
            imagePath,
            amount,
            expiryDate,
            ingredientExpiryDays
        } )
    } catch ( e ) {
        console.error( e )
    }
}