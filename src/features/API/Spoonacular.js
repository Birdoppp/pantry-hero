import axios from "axios";
import React, { useState } from "react";

const url = "https://api.spoonacular.com/recipes/complexSearch?apiKey=850e550630214c8fb9f11f5a1db10196&cuisine=italian&sort=random&number=5";
const baseURL = "https://api.spoonacular.com/";
const apiKey = "850e550630214c8fb9f11f5a1db10196";


async function fetchData( setData ) {


    try {
        const result = axios.get( url );
        setData( result );
    } catch ( e ) {
        console.error( e )
    }
}

export { fetchData }