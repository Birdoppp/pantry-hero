import Dexie from "dexie";

export const db = new Dexie("myDatabase");

export async function checkIfEntryExists( table, key, value ) {
    try {
        const entries = await table.toArray();

        for (const entry of entries) {

            if (entry[key] === value) {
                return true;
            }
        }

        return false;
    } catch ( e ) {
        console.error( e );
        return false;
    }
}

export async function getCheckedItems () {
    try {
        const items = await db.shoppinglist.toArray();

        const checkedItems = items.filter( item => item.checked === true );

        return checkedItems;
    } catch ( e ) {
        console.error( e );
    }
}

db.version(5).stores( {
    pantry: '++id, name, unit, possibleUnits, type, imagePath, amount, expiryDate, ingredientExpiresInDays',
    shoppinglist: '++id, name, unit, possibleUnits, type, imagePath, amount, ingredientExpiresInDays, checked'
} );