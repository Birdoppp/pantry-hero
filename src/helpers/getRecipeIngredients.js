import { getExpiryString } from "./getExpiryString";
import { getRandomArrayEntries } from "./getRandomArrayEntries";

export function getRecipeIngredients( list ) {
    let ingredients;

    const nearExpiryList = list?.filter(( item ) => {
        return item.expiryDate <= getExpiryString( 3 ) && item.expiryDate > getExpiryString( 0 );
    })

    switch ( nearExpiryList.length ) {
        case 0: {
            ingredients = getRandomArrayEntries( list , 2 );
            break;
        }
        case 1: {
            ingredients = [ nearExpiryList[0], getRandomArrayEntries( list , 1 )[0] ];
            break;
        }
        default: ingredients = getRandomArrayEntries( nearExpiryList, 2 );
    }

    return ingredients.map( (ingredient) => ingredient.name );
}