import './App.css';
import { ReactComponent as BackgroundImage } from "./assets/icon-logo.svg"

// Dependencies
import React from "react";
import { Routes, Route } from "react-router-dom";
//import axios from "axios";

// Constructors
import Navigation from "./components/Navigation/Navigation";
import Pantry from "./pages/pantry/Pantry";

function App() {
    return (
        <>
            <BackgroundImage className="background-image"/>

            <header>
                <Navigation/>
            </header>

            <main>
                <Routes>
                    <Route path="/" element={ <Pantry/> }/>
                </Routes>
            </main>

            <footer>

            </footer>
        </>
    );
}

export default App;
