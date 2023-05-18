import Dexie from "dexie";

export const db = new Dexie("myDatabase");

db.version(1).stores( {
    pantry: '++id, name, possibleUnits, unit, type, imagePath, amount, expiryDate, ingredientExpiryDays'
} )