import axios from "axios";

const baseURL = "https://api.spoonacular.com/";
const numIngredientSuggestions = 3;
let controller;

async function fetchIngredientSuggestion( input, signal ) {
    try {
        const result = await axios.get( `${ baseURL }food/ingredients/autocomplete?apiKey=${ process.env.REACT_APP_API_KEY }&query=${ input }&metaInformation=true&number=${ numIngredientSuggestions }`, {
             signal
         } )

        return result.data;
    } catch ( e ) {
        if ( e.name === "CanceledError" ) {
            console.log("fetch aborted");
        } else {
            console.error( e );
        }
        return [];
    }
}

async function fetchRecipes ( input, ingredients ){
    const { cuisines, intolerances, calories, maxCookingTime } = input;

    try {
        const result = await axios.get( `${baseURL}/recipes/complexSearch?apiKey=${process.env.REACT_APP_API_KEY}&cuisine=${cuisines ? cuisines.toString() : ""}&intolerances=${intolerances ? intolerances.toString() : ""}&includeIngredients=${ingredients.toString()}&instructionsRequired=true&fillIngredients=false&addRecipeInformation=true&maxReadyTime=${maxCookingTime}&ignorePantry=false&minCalories=${calories[0]}&maxCalories=${calories[1]}&sort=random&number=6` );

        console.log(result)
    } catch ( e ) {
        console.error( e );
    }
}

function createAbortController() {
    if (controller) {
        controller.abort();
    }
    controller = new AbortController();
    return controller.signal;
}



export { fetchIngredientSuggestion, fetchRecipes, createAbortController }