import React, { useState, useEffect } from 'react';
import PageContainer from "../../components/PageContainer/PageContainer";
import Dashboard from "../../components/Dashboard/Dashboard";
import Button from "../../components/Button/Button";
import DropDownMenu from "../../components/DropDownMenu/DropDownMenu";
import Checkbox from "../../components/Checkbox/Checkbox";
import RangeSelector from "../../components/RangeSelector/RangeSelector";
import SliderSelector from "../../components/SliderSelector/SliderSelector";
import RecipeCard from "../../components/RecipeCard/RecipeCard";
import LoadingIcon from "../../components/LoadingIcon/LoadingIcon";
import { useForm } from "react-hook-form";
import { createAbortController, fetchRecipes, searchRecipeByString } from "../../features/API/Spoonacular";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../features/Database/db";
import { Link } from "react-router-dom";
import { getRandomIngredients } from "../../helpers/getRandomIngredients";
import { getParsedRecipes } from "../../helpers/getParsedRecipes";
import "./Recipes.css"

const signal = createAbortController();
function Recipes() {
    const { handleSubmit, setValue, watch, reset, formState: { errors } } = useForm( {mode: "onSubmit"} );

    const allCuisines = [
        "African",
        "Asian",
        "American",
        "British",
        "Cajun",
        "Caribbean",
        "Chinese",
        "Eastern European",
        "European",
        "French",
        "German",
        "Greek",
        "Indian",
        "Irish",
        "Italian",
        "Japanese",
        "Jewish",
        "Korean",
        "Latin American",
        "Mediterranean",
        "Mexican",
        "Middle Eastern",
        "Nordic",
        "Southern",
        "Spanish",
        "Thai",
        "Vietnamese"
    ];
    const allDiets = [
        "Gluten free",
        "Ketogenic",
        "Vegetarian",
        "Vegan",
        "Paleo"
    ];
    const allIntolerances = [
        "Dairy",
        "Egg",
        "Gluten",
        "Grain",
        "Peanut",
        "Seafood",
        "Sesame",
        "Shellfish",
        "Soy",
        "Sulfite",
        "Tree nut",
        "Wheat"
    ];

    // STATES
    const [ calorieValues, setCalorieValues ] = useState([ 0, 1200 ]);
    const [ maxCookingTime, setMaxCookingTime ] = useState(60);
    const [ recipes, setRecipes ] = useState( getParsedRecipes );
    const [ recipesAreLoading, setRecipesAreLoading ] = useState(false);
    const [ searchResults, setSearchResults ] = useState(null);

    // DATABASE
    const myPantry = useLiveQuery(
        () => db.pantry.toArray()
    );

    // USE EFFECTS
    useEffect(() => {
        setValue( "calories", calorieValues );
    }, [ calorieValues, setValue ]);

    useEffect( () => {
        setValue( "maxCookingTime", maxCookingTime );
    }, [ maxCookingTime, setValue ] );

    // HANDLERS
    function handleCuisineChange( cuisine ) {
        const cuisines = watch( "cuisines" ) || [];
        const updatedCuisines = cuisines.includes( cuisine ) ?
            cuisines.filter(( item ) => item !== cuisine) :
            [ ...cuisines, cuisine ];
        setValue("cuisines", updatedCuisines);
    }

    function handleDietChange( diet ) {
        const diets = watch( "diets" ) || [];
        const updatedDiets = diets.includes( diet ) ?
            diets.filter(( item ) => item !== diet) :
            [ ...diets, diet ];
        setValue("diets", updatedDiets);
    }

    function handleIntoleranceChange( intolerance ) {
        const intolerances = watch( "intolerances" ) || [];
        const updatedIntolerances = intolerances.includes( intolerance ) ?
            intolerances.filter(( item ) => item !== intolerance) :
            [ ...intolerances, intolerance ];
        setValue("intolerances", updatedIntolerances);
    }

    async function handleFormSubmit( data ) {
        setRecipesAreLoading( true );

        const ingredients = getRandomIngredients( myPantry );

        fetchRecipes( data, ingredients, signal )
            .then( () => {
                setRecipes( getParsedRecipes );
            })
            .finally( () => {
                setRecipesAreLoading( false );
            });
    }

    function handleFormClear() {
        reset();
    }

    function handleEnterPress() {
        setRecipesAreLoading( true );

        void searchRecipeByString( searchResults, signal )
            .then( () => {
                setRecipes( getParsedRecipes );
            })
            .finally( () => {
                setRecipesAreLoading( false );
            });
    }

    async function searchRecipes( query ) {
        if ( query.trim() === "" ) {
            setSearchResults( null );
        } else {
            setSearchResults( query );
        }
    }

    return (
        <PageContainer
            title="My recipes"
            searchPlaceHolder="recipes"
            onSearch={ searchRecipes }
            onEnterPress={ handleEnterPress }
        >
            <div
                id="recipe-overview"
                className="inner-container"
            >
                <Dashboard className="dashboard">
                    <div>
                        <h3>Preferences:</h3>
                        <form id="search-recipe-form" onSubmit={ handleSubmit( handleFormSubmit ) }>
                            <DropDownMenu title="Cuisine">
                                { allCuisines.map(( cuisine, index) => (
                                    <div
                                        className="checkbox-selector"
                                        key={ `cuisine-${ index }` }
                                    >
                                        <Checkbox
                                            clickHandler={ () => handleCuisineChange( cuisine ) }
                                            isLarge={ false }
                                        />
                                        <p>{ cuisine }</p>
                                    </div>
                                ) ) }
                            </DropDownMenu>

                            <DropDownMenu title="Diet">
                                { allDiets.map(( diet, index) => (
                                    <div
                                        className="checkbox-selector"
                                        key={ `diet-${ index }` }
                                    >
                                        <Checkbox
                                            clickHandler={ () => handleDietChange( diet ) }
                                            isLarge={ false }
                                        />
                                        <p>{ diet }</p>
                                    </div>
                                ) ) }
                            </DropDownMenu>

                            <DropDownMenu title="Intolerances">
                                { allIntolerances.map(( intolerance, index ) => (
                                    <div
                                        className="checkbox-selector"
                                        key={ `intolerance-${ index }` }
                                    >
                                        <Checkbox
                                            clickHandler={ () => handleIntoleranceChange( intolerance ) }
                                        />
                                        <p>{ intolerance }</p>
                                    </div>
                                ) ) }
                            </DropDownMenu>

                            <DropDownMenu title="Calories per serving">
                                <RangeSelector
                                    range={ calorieValues }
                                    rangeSetter={ setCalorieValues }
                                    rangeMin={ 0 }
                                    rangeMax={ 1200 }
                                />
                            </DropDownMenu>

                            <DropDownMenu title="Cooking time">
                                <SliderSelector
                                    value={ maxCookingTime }
                                    setter={ setMaxCookingTime }
                                />
                            </DropDownMenu>

                            <div id="form-handler-buttons">
                                <Button
                                    textValue="clear"
                                    type="button"
                                    clickHandler={ handleFormClear }
                                    filledStatus={ false }
                                />

                                <Button
                                    textValue="apply"
                                    type="submit"
                                    filledStatus={ true }
                                />
                            </div>
                        </form>
                    </div>
                </Dashboard>

                <div id="recipe-list-overview">
                    { recipesAreLoading ? (
                        <LoadingIcon/>
                    ) : (
                        recipes.length > 0 &&
                        recipes.map(( recipe, index ) => (
                            <RecipeCard key={`recipe-${ index }`} recipe={ recipe } />
                        ))
                    ) }
                </div>

                <Link to="/selection">
                    <button type="button">To other page</button>
                </Link>
            </div>
        </PageContainer>
    );
}

export default Recipes;