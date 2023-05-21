import './App.css';

// Dependencies
import React from "react";
import { Routes, Route } from "react-router-dom";
//import axios from "axios";

// Constructors
import Pantry from "./components/Pantry/Pantry";

function App() {
    return (
        <>
            <header>
                <Routes>
                    <Route path="/" element={"homepage hier neerzetten"}/>
                </Routes>
            </header>

            <main className="inner-container">
                <Pantry/>
            </main>

            <footer>

            </footer>
        </>
    );
}

export default App;
