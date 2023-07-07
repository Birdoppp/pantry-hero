export function getParsedSelection() {
    const storedRecipes = localStorage.getItem("recipeSelection");

    return storedRecipes ? JSON.parse(storedRecipes) : [];
}