export function getParsedRecipes() {
    const storedRecipes = localStorage.getItem("recipes");

    return storedRecipes ? JSON.parse(storedRecipes) : [];
}