import React from 'react';
import { ReactComponent as IconReturn } from "../../assets/icon-arrow_back.svg";
import { ReactComponent as IconPrepTime } from "../../assets/icon-prep_time.svg";
import { ReactComponent as IconServingInfo } from "../../assets/icon-servings.svg";
import "./RecipePopup.css";

function RecipePopup({ recipe, onClose }) {
    const { image, title, readyInMinutes, servings } = recipe

    return (
        <div className="popup-container">
            <div className="recipe-popup">
                <div id="image-container">
                    <img src={ image } alt={ title } />
                    <button
                        type="button"
                        className="return-button"
                        onClick={ onClose }
                    ><IconReturn/></button>
                </div>

                <article id="recipe">
                    <h2>{ title }</h2>

                    <div id="recipe-data">
                        <div className="recipe-data-block">
                            <IconPrepTime/>
                            <div>{ readyInMinutes } min</div>
                        </div>

                        <div className="recipe-data-block">
                            <IconServingInfo/>
                            <div>{ servings }</div>
                        </div>
                    </div>

                </article>
            </div>
        </div>
    );
}

export default RecipePopup;