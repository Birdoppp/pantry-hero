import React from "react";

// STYLES
import "./Homepage.css"

function Homepage() {
    return (
        <div
            id="homepage"
            className="outer-container"
        >
            <div className="features">
                <h2>Features</h2>
                <ul>
                    <li>Your pantry in one simple overview</li>
                    <li>Keep track of expiry</li>
                    <li>Find recipes that fit your tastes</li>
                    <li>Easily manage your shopping list</li>
                </ul>
            </div>
        </div>
    );
}

export default Homepage;