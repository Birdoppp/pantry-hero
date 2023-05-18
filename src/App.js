import './App.css';

// Dependencies
import React from "react";
//import axios from "axios";

// Constructors
import PantryItem from "./components/PantryItem/PantryItem";
import Ingredient from "./constructors/Ingredient/Ingredient";
import {db} from "./features/Database/db";
import {useLiveQuery} from "dexie-react-hooks";
import Pantry from "./components/Pantry/Pantry";


function App() {
    const date = new Date();
    date.setDate(date.getDate());

    const pineapple = new Ingredient(
        "pineapple",
        ["piece",
            "slice",
            "fruit",
            "g",
            "oz",
            "cup",
            "serving"],
        "piece",
        "Produce",
        "pineapple.jpg",
        10,
        date,
        5
    );

    const apple = new Ingredient(
        "apple",
        ["pieces",
            "serving",
            "g"],
        "g",
        "Produce",
        "apple.jpg",
        8,
        date,
        5
    );

    //const myPantry = [ pineapple, apple ];



    //addIngredient(pineapple).then( (value) => console.log(value) );
    //db.pantry.clear();

    const myPantry = useLiveQuery(
        () => db.pantry.toArray()
    );



    return (
        <>
            <header></header>
            <main className="inner-container">
                {/*{myPantry.map( (obj) => (*/}
                {/*    <PantryItem ingredient={obj}/>*/}
                {/*))}*/}

                {/*{ myPantry?.map(item => (*/}
                {/*    <PantryItem ingredient={item}/>*/}
                {/*))}*/}
                <Pantry/>
                <PantryItem ingredient={pineapple}/>
            </main>
            <footer></footer>
        </>
    );
}

export default App;
