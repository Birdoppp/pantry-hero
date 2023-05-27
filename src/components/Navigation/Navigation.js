import React from 'react';
import { NavLink } from "react-router-dom";
import "./Navigation.css"
import { ReactComponent as Logo } from "../../assets/icon-logo.svg";

function Navigation() {
    return (
        <nav className="navigation-bar">
            <div className="app-logo">
                <Logo className="logo"/>
                <h2>Pantry Hero</h2>
            </div>

            <ul className="page-link-list">
                <li>
                    <NavLink className={({ isActive }) => isActive ? 'page-link active-menu-link' : 'page-link default-menu-link'} to="/pantry">My pantry</NavLink>
                </li>
                <li>
                    <NavLink className={({ isActive }) => isActive ? 'page-link active-menu-link' : 'page-link default-menu-link'} to="/shoppinglist">Shopping list</NavLink>
                </li>
                <li>
                    <NavLink className={({ isActive }) => isActive ? 'page-link active-menu-link' : 'page-link default-menu-link'} to="/recipes">Recipes</NavLink>
                </li>
            </ul>

            <div className="hamburger-menu"></div>
        </nav>
    );
}

export default Navigation;