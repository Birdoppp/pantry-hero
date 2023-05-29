import './App.css';
import { ReactComponent as BackgroundImage } from "./assets/icon-logo.svg"

// Dependencies
import React from "react";
import { Routes, Route } from "react-router-dom";

// Constructors
import Navigation from "./components/Navigation/Navigation";
import Pantry from "./pages/pantry/Pantry";
import ShoppingList from "./pages/shoppinglist/ShoppingList";
import Recipes from "./pages/recipes/Recipes";

function App() {
    return (
        <>
            <BackgroundImage className="background-image"/>

            <header>
                <Navigation/>
            </header>

            <main>
                <Routes>
                    <Route path="/pantry" element={ <Pantry/> }/>
                    <Route path="/shoppinglist" element={ <ShoppingList/> }/>
                    <Route path="/recipes" element={ <Recipes/> }/>
                </Routes>
            </main>

            <footer>

            </footer>
        </>
    );
}

export default App;
