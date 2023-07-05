export function getRequiredIngredients( recipe ) {
    const originalIngredientsList = recipe.nutrition.ingredients;
    const newIngredientsList = {};
    const servings = recipe.servings;

    originalIngredientsList.forEach(( ingredient ) => {
        const { name, amount, unit } = ingredient;

        if ( unit && name.toLowerCase() !== "water" ) {
            if (newIngredientsList.hasOwnProperty( name )) {
                newIngredientsList[ name ].amount += getNumericAmount( amount, servings );
            } else {
                switch ( unit ) {
                    case "C": {
                        newIngredientsList[ name ] = {
                            name,
                            amount: getNumericAmount( amount, servings ),
                            unit: "cup"
                        };
                        break;
                    }
                    default: newIngredientsList[ name ] = {
                        name,
                        amount: getNumericAmount( amount, servings ),
                        unit
                    };
                }

            }
        }
    } );

    return Object.values(newIngredientsList);
}

function getNumericAmount( amount, servings ) {
    const fullAmount = amount * servings;
    const closestInt = Math.round(fullAmount);
    const rounded = parseFloat(fullAmount.toFixed(1));
    const difference = Math.abs( rounded - closestInt );

    if ( difference > 0.15 ) {
        return parseFloat( rounded );
    } else {
        return closestInt;
    }
}