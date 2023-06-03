import Dexie from "dexie";

export const db = new Dexie("myDatabase");

db.version(5).stores( {
    pantry: '++id, name, unit, possibleUnits, type, imagePath, amount, expiryDate, ingredientExpiresInDays',
    shoppinglist: '++id, name, unit, possibleUnits, type, imagePath, amount, ingredientExpiresInDays, checked'
} );