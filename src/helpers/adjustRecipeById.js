export function adjustRecipeById( recipe ) {
    const recipes = JSON.parse( localStorage.getItem( "recipes" ) || [] );
    const idIndex = recipes.findIndex( obj => obj.id === recipe.id );

    if ( idIndex !== -1 ) {
        recipes[idIndex] = recipe;
    } else {
        recipes.push( recipe );
    }

    localStorage.setItem( "recipes", JSON.stringify(recipes) );
}