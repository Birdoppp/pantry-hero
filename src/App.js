import './App.css';

// Dependencies
import React from "react";
//import axios from "axios";

// Constructors
import PantryItem from "./components/PantryItem/PantryItem";
import Ingredient from "./constructors/Ingredient/Ingredient";


function App() {
    const date = new Date();
    date.setDate(date.getDate() + 5);

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

    const myPantry = [ pineapple, apple ];

    // const handleDelete = ( index ) => {
    //     const newArray = [...myPantry];
    //     newArray.splice(index, 1);
    //     setMyPantry(newArray);
    // }

    return (
        <>
            <header></header>
            <main className="inner-container">
                {myPantry.map( (obj, index) => (
                    <PantryItem key={index}
                                ingredient={obj}
                                index={index}
                    />
                ))}
            </main>
            <footer></footer>
        </>
    );
}

export default App;
