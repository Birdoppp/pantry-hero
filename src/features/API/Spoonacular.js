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

async function fetchRecipes( input, ingredients ) {
    const { cuisines, diets, intolerances, calories, maxCookingTime } = input;
    const allResults = [];

    try {
        async function processResult( ingredient ) {
            const result = await axios.get(
                `${baseURL}/recipes/complexSearch?apiKey=${process.env.REACT_APP_API_KEY}&cuisine=${cuisines ? cuisines.toString() : ""}&diet=${diets ? diets.toString() : ""}&intolerances=${intolerances ? intolerances.toString() : ""}&includeIngredients=${ingredient ? ingredient.toLowerCase() : ""}&instructionsRequired=true&fillIngredients=false&addRecipeInformation=true&maxReadyTime=${maxCookingTime}&ignorePantry=false&minCalories=${calories[0]}&maxCalories=${calories[1]}&sort=random&number=3`
            );
            const data = result.data.results;

            if (data.length === 3) {
                for (let i = 0; i < data.length; i++) {
                    allResults.push(data[i]);
                }
            } else {
                await processResult();
            }
        };

        const firstResult = await processResult( ingredients[0] );
        const secondResult = await processResult( ingredients[1] );

        console.log(allResults);
    } catch (e) {
        console.error(e);
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