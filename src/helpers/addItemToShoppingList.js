import { db } from "../features/Database/db";

export async function addItemToShoppingList(name, unit, possibleUnits, type, imagePath, amount, ingredientExpiresInDays, checked ) {

    try{
        const id = await db.shoppinglist.add( {
            name,
            unit,
            possibleUnits,
            type,
            imagePath,
            amount,
            ingredientExpiresInDays,
            checked
        } )
    } catch ( e ) {
        console.error( e )
    }
}