import React from "react";

// STYLES
import "./RecipeSubtitle.css"

function RecipeSubtitle({ children }) {
    return (
        <div className="recipe-subtitle">
            <span id="subtitle-children">{ children }</span>
            <div id="subtitle-underline"></div>
        </div>
    );
}

export default RecipeSubtitle;