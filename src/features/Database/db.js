import Dexie from "dexie";

export const db = new Dexie("myDatabase");

db.version(4).stores( {
    pantry: '++id, name, unit, type, imagePath, amount, expiryDate, ingredientExpiryDays',
    shoppinglist: '++id, name, unit, type, imagePath, amount, expiryDate, ingredientExpiryDays'
} );