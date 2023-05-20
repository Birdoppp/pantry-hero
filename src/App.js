import './App.css';

// Dependencies
import React from "react";
//import axios from "axios";

// Constructors
import Pantry from "./components/Pantry/Pantry";

function App() {
    return (
        <>
            <header></header>
            <main className="inner-container">
                <Pantry/>
            </main>
            <footer></footer>
        </>
    );
}

export default App;
