import './App.css';

// Dependencies
import React, {useContext, useEffect} from "react";
import {Routes, Route, useNavigate} from "react-router-dom";
import { AuthContext } from "./context/AuthProvider";

// Constructors
import Navigation from "./components/Navigation/Navigation";
import Pantry from "./pages/pantry/Pantry";
import ShoppingList from "./pages/shoppinglist/ShoppingList";
import Recipes from "./pages/recipes/Recipes";
import Homepage from "./pages/homepage/Homepage";

function App() {
    const navigate = useNavigate();
    const { isAuth } = useContext( AuthContext );

    useEffect(() => {
        if (!isAuth) {
            navigate('/');
        }
    }, [isAuth, navigate]);


    return (
        <>
            <header>
                <Navigation/>
            </header>

            <main>
                <Routes>
                    <Route path="/" element={ <Homepage/> }/>
                    <Route path="/pantry" element={<Pantry />} />
                    <Route path="/shoppinglist" element={<ShoppingList />} />
                    <Route path="/recipes" element={<Recipes />} />
                </Routes>
            </main>

            <footer>

            </footer>
        </>
    );
}

export default App;
