export function adjustRecipeById( recipe, storage ) {
    const recipes = JSON.parse( localStorage.getItem( storage ) || [] );
    const idIndex = recipes.findIndex( obj => obj.id === recipe.id );

    if ( idIndex !== -1 ) {
        recipes[idIndex] = recipe;
    } else {
        recipes.push( recipe );
    }

    localStorage.setItem( storage, JSON.stringify(recipes) );
}