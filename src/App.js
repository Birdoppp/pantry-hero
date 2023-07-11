import React, { useContext, useEffect, useRef, useState } from "react";

// DEPENDENCIES
import {Routes, Route, useNavigate, useLocation, Link} from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";

// CONSTRUCTORS
import Navigation from "./components/Navigation/Navigation";
import Pantry from "./pages/pantry/Pantry";
import ShoppingList from "./pages/shoppinglist/ShoppingList";
import Recipes from "./pages/recipes/Recipes";
import Homepage from "./pages/homepage/Homepage";
import Selection from "./pages/selection/Selection";

// CONTEXT
import { AuthContext } from "./context/AuthProvider";

// STYLES
import "./App.css";

function App() {
    const location = useLocation();
    const prevLocationRef = useRef();
    const navigate = useNavigate();
    const { isAuth } = useContext( AuthContext );

    useEffect(() => {
        if (!isAuth) {
            navigate("/");
        }
    }, [isAuth, navigate]);


    useEffect(() => {
        prevLocationRef.current = location;
    }, [location]);

    const [delayedClassName, setDelayedClassName] = useState("");

    useEffect(() => {
        if (location.pathname !== "/recipes") {
            setDelayedClassName("");
        }
    }, [location.pathname]);

    function getSlideDirection() {
        const prevPathName = prevLocationRef.current ? prevLocationRef.current.pathname : location.pathname;
        const currentPathName = location.pathname;

        if (currentPathName === "/recipes") {
            if (prevPathName === "/selection") {
                return "slide-left";
            } else {
                setTimeout(() => {
                    setDelayedClassName("slide-left");
                }, 1000);
            }
        } else if (currentPathName === "/selection") {
            if (prevPathName === "/recipes" || prevPathName === "/selection") {
                return "slide-right";
            }
        }

        return delayedClassName || "";
    }

    return (
        <div className="app">
            <header>
                <Navigation/>
            </header>

            <main>
                <TransitionGroup component={ null }>
                    <CSSTransition
                        key={ location.key }
                        classNames={ getSlideDirection() }
                        timeout={ { enter: 1000, exit: 1000 } }
                    >
                        <Routes location={ location }>
                            <Route path="/" element={<Homepage />} />
                            <Route path="/pantry" element={<Pantry />} />
                            <Route path="/shoppinglist" element={<ShoppingList />} />
                            <Route path="/recipes" element={<Recipes />} />
                            <Route path="/selection" element={<Selection />} />
                        </Routes>
                    </CSSTransition>
                </TransitionGroup>

                { ( location.pathname === "/recipes" || location.pathname === "/selection" ) &&
                    <div className="transition-button-container">
                        <div id="transition-button-background">

                            <div id="button-overlay"  className={ location.pathname === "/recipes" ? "btn-slide-left" : "btn-slide-right" }></div>

                            <Link to="/recipes" className="button-link">
                                <button className="transition-button" type="button">Recipe suggestions</button>
                            </Link>

                            <Link to="/selection" className="button-link">
                                <button className="transition-button" type="button">My recipes</button>
                            </Link>
                        </div>
                    </div>
                }
            </main>

        </div>
    );
}

export default App;
