import './App.css';

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
            <header>
                <Navigation/>
            </header>

            <main className="inner-container">
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
