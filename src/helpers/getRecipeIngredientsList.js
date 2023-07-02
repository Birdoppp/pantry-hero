export function getRecipeIngredientsList( recipe ) {
    const instructions = recipe.analyzedInstructions[0].steps;
    let ingredientsSet = new Set();

    for (let i = 0; i < instructions.length; i++) {
        const ingredients = instructions[i].ingredients;

        for (let j = 0; j < ingredients.length; j++) {
            const ingredient = ingredients[j].name;

            if (ingredient.toLowerCase() === "water") {
                continue;
            }

            ingredientsSet.add(ingredient);
        }
    }

    return Array.from(ingredientsSet);
}