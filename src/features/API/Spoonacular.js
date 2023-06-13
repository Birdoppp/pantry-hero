import axios from "axios";

const baseURL = "https://api.spoonacular.com/";
const numIngredientSuggestions = 3;
let controller;

async function fetchIngredientSuggestion(input, signal) {
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

function createAbortController() {
    if (controller) {
        controller.abort();
    }
    controller = new AbortController();
    return controller.signal;
}



export { fetchIngredientSuggestion, createAbortController }