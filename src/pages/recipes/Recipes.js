import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { fetchRecipes } from "../../features/API/Spoonacular";
import PageContainer from "../../components/PageContainer/PageContainer";
import Dashboard from "../../components/Dashboard/Dashboard";
import Button from "../../components/Button/Button";
import DropDownMenu from "../../components/DropDownMenu/DropDownMenu";
import Checkbox from "../../components/Checkbox/Checkbox";
import RangeSelector from "../../components/RangeSelector/RangeSelector";
import SliderSelector from "../../components/SliderSelector/SliderSelector";
import "./Recipes.css"
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../features/Database/db";
import {getExpiryString} from "../../helpers/getExpiryString";

function Recipes() {
    const { handleSubmit, setValue, watch } = useForm( {mode: "onSubmit"} );
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
    }, [ maxCookingTime, setValue ] )

    // HANDLERS
    function handleCuisineChange( cuisine ) {
        const cuisines = watch( "cuisines" ) || [];
        const updatedCuisines = cuisines.includes( cuisine ) ?
            cuisines.filter(( item ) => item !== cuisine) :
            [ ...cuisines, cuisine ];
        setValue("cuisines", updatedCuisines);
    }

    function handleIntoleranceChange( intolerance ) {
        const intolerances = watch( "intolerances" ) || [];
        const updatedIntolerances = intolerances.includes( intolerance ) ?
            intolerances.filter(( item ) => item !== intolerance) :
            [ ...intolerances, intolerance ];
        setValue("intolerances", updatedIntolerances);
    }

    function onSubmit (data) {
        const ingredients = ["grappa"];

        //console.log(getExpiringIngredients( myPantry, 3, 0));

        void fetchRecipes( data, ingredients );
    }

    function getExpiringIngredients( list, offset, checkDate ) {
        return list?.filter((item) => {
            if (item.expiryDate || item.expiryDate === 0) {
                if ( checkDate || checkDate === 0 ) {
                    return item.expiryDate <= getExpiryString( offset ) && item.expiryDate > getExpiryString( checkDate );
                } else if ( offset === 0 ) {
                    return item.expiryDate <= getExpiryString( offset );
                } else {
                    return item.expiryDate > getExpiryString( offset );
                }
            }
        })
    }

    return (
        <>
            <PageContainer
                title="My recipes"
                searchPlaceHolder="recipes"
                onSearch={ () => console.log("Searching...") }
            >
                <div
                    id="recipe-overview"
                    className="inner-container"
                >
                    <Dashboard className="dashboard">
                        <div>
                            <h3>Preferences:</h3>
                            <form id="search-recipe-form" onSubmit={ handleSubmit( onSubmit ) }>
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
                                        textValue="refresh"
                                        type="submit"
                                        clickHandler={ () => console.log("Clicked refresh") }
                                        filledStatus={ false }
                                    />

                                    <Button
                                        textValue="apply"
                                        type="submit"
                                        clickHandler={ () => console.log("Clicked submit") }
                                        filledStatus={ true }
                                    />
                                </div>
                            </form>
                        </div>
                    </Dashboard>
                </div>
            </PageContainer>
        </>
    );
}

export default Recipes;