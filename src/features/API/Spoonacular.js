import axios from "axios";
import React, { useState } from "react";

const url = "https://api.spoonacular.com/recipes/complexSearch?apiKey=850e550630214c8fb9f11f5a1db10196&cuisine=italian&sort=random&number=5";
const baseURL = "https://api.spoonacular.com/";
const apiKey = "850e550630214c8fb9f11f5a1db10196";
const numIngredientSuggestions = 5;

const controller = new AbortController();

async function fetchData( setData ) {
    try {
        const result = axios.get( url );
        setData( result );
    } catch ( e ) {
        console.error( e )
    }
}

async function fetchIngredientSuggestion ( input, setData, showPopout ){
    try {
        const result = await axios.get( `${baseURL}food/ingredients/autocomplete?apiKey=${apiKey}&query=${input}&metaInformation=true&number=${numIngredientSuggestions}`, {
            signal: controller.signal,
        } )
        const data = result.data;

        setData( data );
        showPopout( data.length > 0 );
    } catch ( e ) {
        console.error( e )
    }
}

function apiCleanUp() {
    controller.abort();
}

export { fetchData, fetchIngredientSuggestion, apiCleanUp }