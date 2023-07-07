import axios from "axios";

const baseURL = "https://api.spoonacular.com/";
const numIngredientSuggestions = 5;
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

async function fetchRecipes( input, ingredients, signal ) {
    const { cuisines, diets, intolerances, calories, maxCookingTime } = input;
    const allResults = [];

    try {
        async function processResult( ingredient ) {
            const result = await axios.get(
                `${baseURL}/recipes/complexSearch?apiKey=${process.env.REACT_APP_API_KEY}&cuisine=${cuisines ? cuisines.toString() : ""}&diet=${diets ? diets.toString() : ""}&intolerances=${intolerances ? intolerances.toString() : ""}&includeIngredients=${ingredient ? ingredient.toLowerCase() : ""}&instructionsRequired=true&fillIngredients=false&addRecipeInformation=true&addRecipeNutrition=true&maxReadyTime=${maxCookingTime}&ignorePantry=false&minCalories=${calories[0]}&maxCalories=${calories[1]}&sort=random&number=3`, {
                    signal
                }
            );
            const data = result.data.results;

            if ( data.length === 3 ) {
                for (let i = 0; i < data.length; i++) {
                    allResults.push( data[i] );
                }
            } else {
                await processResult();
            }
        }

        await processResult( ingredients[0] );
        await processResult( ingredients[1] );

        localStorage.removeItem("recipes");
        localStorage.setItem("recipes", JSON.stringify( allResults ));
    } catch (e) {
        console.error(e);
    }
}

async function searchRecipeByString( stringInput, signal ) {
    try {
        const result = await axios.get( `${baseURL}/recipes/complexSearch?apiKey=${process.env.REACT_APP_API_KEY}&query=${ stringInput }&instructionsRequired=true&fillIngredients=false&addRecipeInformation=true&addRecipeNutrition=true&ignorePantry=false&sort=random&number=6`, {
                signal
            }
        );

        localStorage.removeItem("recipes");
        localStorage.setItem("recipes", JSON.stringify( result.data.results ));
    } catch ( e ) {
        console.error( e );
    }
}

async function adjustIngredientUnit( ingredient, desiredUnit ) {
    const { name, amount, unit } = ingredient;

    try {
        const result = await axios.get(`${baseURL}/recipes/convert?apiKey=${process.env.REACT_APP_API_KEY}&ingredientName=${name}&sourceAmount=${amount}&sourceUnit=${unit}&targetUnit=${desiredUnit}`);

        return result.data.targetAmount;
    } catch ( e ) {
        console.error( e );
    }
}

async function getIngredientInfoByName( name ) {
    try {
        const result = await axios.get( `${baseURL}/food/ingredients/search?apiKey=${process.env.REACT_APP_API_KEY}&query=${name}&metaInformation=true&number=1` )

        return result.data.results;
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



export { fetchIngredientSuggestion, fetchRecipes, searchRecipeByString, adjustIngredientUnit, getIngredientInfoByName, createAbortController }