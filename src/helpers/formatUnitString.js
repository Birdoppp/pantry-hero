export function formatUnitString(unitString) {
    let str = "";

    if (unitString.includes("tablespoon")) {
        str = "tbsp";
    } else if (unitString.includes("teaspoon")) {
        str = "tsp";
    } else {
        str = unitString;
    }

    return str.toLowerCase();
}