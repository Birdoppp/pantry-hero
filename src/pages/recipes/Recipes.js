import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { fetchRecipes } from "../../features/API/Spoonacular";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../features/Database/db";
import { getRandomIngredients } from "../../helpers/getRandomIngredients";
import PageContainer from "../../components/PageContainer/PageContainer";
import Dashboard from "../../components/Dashboard/Dashboard";
import Button from "../../components/Button/Button";
import DropDownMenu from "../../components/DropDownMenu/DropDownMenu";
import Checkbox from "../../components/Checkbox/Checkbox";
import RangeSelector from "../../components/RangeSelector/RangeSelector";
import SliderSelector from "../../components/SliderSelector/SliderSelector";
import RecipeCard from "../../components/RecipeCard/RecipeCard";
import "./Recipes.css"

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

    function onSubmit( data ) {
        const ingredients = getRandomIngredients( myPantry );

        void fetchRecipes( data, ingredients, 3 );
    }

    const testRecipe = {
        "vegetarian": true,
        "vegan": true,
        "glutenFree": true,
        "dairyFree": true,
        "veryHealthy": false,
        "cheap": false,
        "veryPopular": false,
        "sustainable": false,
        "lowFodmap": false,
        "weightWatcherSmartPoints": 3,
        "gaps": "no",
        "preparationMinutes": -1,
        "cookingMinutes": -1,
        "aggregateLikes": 0,
        "healthScore": 1,
        "creditsText": "mlubbe",
        "license": "spoonacular's terms",
        "sourceName": "spoonacular",
        "pricePerServing": 37.01,
        "id": 1697397,
        "title": "Avocado chocolate truffles",
        "author": "mlubbe",
        "readyInMinutes": 40,
        "servings": 12,
        "sourceUrl": "https://spoonacular.com/app-1642232393346",
        "image": "https://spoonacular.com/recipeImages/1697397-312x231.jpg",
        "imageType": "jpg",
        "summary": "Need a <b>gluten free, dairy free, lacto ovo vegetarian, and vegan side dish</b>? Avocado chocolate truffles could be an amazing recipe to try. This recipe serves 12. For <b>37 cents per serving</b>, this recipe <b>covers 3%</b> of your daily requirements of vitamins and minerals. One serving contains <b>80 calories</b>, <b>1g of protein</b>, and <b>6g of fat</b>. This recipe from spoonacular user <a href=\"/profile/mlubbe\">mlubbe</a> requires chocolate, cocoa powder, brown sugar, and vanillan essence. From preparation to the plate, this recipe takes about <b>40 minutes</b>. Similar recipes are <a href=\"https://spoonacular.com/recipes/chocolate-avocado-truffles-871855\">Chocolate Avocado Truffles</a>, <a href=\"https://spoonacular.com/recipes/chocolate-avocado-truffles-540451\">Chocolate Avocado Truffles</a>, and <a href=\"https://spoonacular.com/recipes/2-ingredient-chocolate-avocado-truffles-1517309\">2 Ingredient Chocolate Avocado Truffles</a>.",
        "cuisines": [],
        "dishTypes": [
            "side dish"
        ],
        "diets": [
            "gluten free",
            "dairy free",
            "lacto ovo vegetarian",
            "vegan"
        ],
        "occasions": [],
        "analyzedInstructions": [
            {
                "name": "",
                "steps": [
                    {
                        "number": 1,
                        "step": "Note: needs 30 minutes in fridge.",
                        "ingredients": [],
                        "equipment": [],
                        "length": {
                            "number": 30,
                            "unit": "minutes"
                        }
                    },
                    {
                        "number": 2,
                        "step": "Boil a kettle of water for melting the chocolate in a double boiler.",
                        "ingredients": [
                            {
                                "id": 19081,
                                "name": "chocolate",
                                "localizedName": "chocolate",
                                "image": "milk-chocolate.jpg"
                            },
                            {
                                "id": 14412,
                                "name": "water",
                                "localizedName": "water",
                                "image": "water.png"
                            }
                        ],
                        "equipment": [
                            {
                                "id": 404699,
                                "name": "double boiler",
                                "localizedName": "double boiler",
                                "image": "double-boiler.jpg"
                            }
                        ]
                    },
                    {
                        "number": 3,
                        "step": "Blend the avocado into a smooth consistency.",
                        "ingredients": [
                            {
                                "id": 9037,
                                "name": "avocado",
                                "localizedName": "avocado",
                                "image": "avocado.jpg"
                            }
                        ],
                        "equipment": []
                    },
                    {
                        "number": 4,
                        "step": "COAT: Prepare coating ingredients in a bowl (raw cocoa, dessicated coconut, or ground almonds).",
                        "ingredients": [
                            {
                                "id": 93740,
                                "name": "almond meal",
                                "localizedName": "almond meal",
                                "image": "almond-meal-or-almond-flour.jpg"
                            },
                            {
                                "id": 12104,
                                "name": "coconut",
                                "localizedName": "coconut",
                                "image": "coconut.jpg"
                            },
                            {
                                "id": 19165,
                                "name": "cocoa powder",
                                "localizedName": "cocoa powder",
                                "image": "cocoa-powder.png"
                            }
                        ],
                        "equipment": [
                            {
                                "id": 404783,
                                "name": "bowl",
                                "localizedName": "bowl",
                                "image": "bowl.jpg"
                            }
                        ]
                    },
                    {
                        "number": 5,
                        "step": "Cut wax paper to fit into a tray or plate.",
                        "ingredients": [],
                        "equipment": [
                            {
                                "id": 404739,
                                "name": "wax paper",
                                "localizedName": "wax paper",
                                "image": "wax-paper.jpg"
                            }
                        ]
                    },
                    {
                        "number": 6,
                        "step": "COOK: Break the chocolate into smaller pieces and melt it in a double boiler over a low heat.",
                        "ingredients": [
                            {
                                "id": 19081,
                                "name": "chocolate",
                                "localizedName": "chocolate",
                                "image": "milk-chocolate.jpg"
                            }
                        ],
                        "equipment": [
                            {
                                "id": 404699,
                                "name": "double boiler",
                                "localizedName": "double boiler",
                                "image": "double-boiler.jpg"
                            }
                        ]
                    },
                    {
                        "number": 7,
                        "step": "Add the salt and vanilla essence.",
                        "ingredients": [
                            {
                                "id": 1012050,
                                "name": "artificial vanilla",
                                "localizedName": "artificial vanilla",
                                "image": "vanilla-extract.jpg"
                            },
                            {
                                "id": 2047,
                                "name": "salt",
                                "localizedName": "salt",
                                "image": "salt.jpg"
                            }
                        ],
                        "equipment": []
                    },
                    {
                        "number": 8,
                        "step": "Remove from the heat once the chocolate has melted.",
                        "ingredients": [
                            {
                                "id": 19081,
                                "name": "chocolate",
                                "localizedName": "chocolate",
                                "image": "milk-chocolate.jpg"
                            }
                        ],
                        "equipment": []
                    },
                    {
                        "number": 9,
                        "step": "Add the chocolate and cocoa powder to the blender with the avocado.",
                        "ingredients": [
                            {
                                "id": 19165,
                                "name": "cocoa powder",
                                "localizedName": "cocoa powder",
                                "image": "cocoa-powder.png"
                            },
                            {
                                "id": 19081,
                                "name": "chocolate",
                                "localizedName": "chocolate",
                                "image": "milk-chocolate.jpg"
                            },
                            {
                                "id": 9037,
                                "name": "avocado",
                                "localizedName": "avocado",
                                "image": "avocado.jpg"
                            }
                        ],
                        "equipment": [
                            {
                                "id": 404726,
                                "name": "blender",
                                "localizedName": "blender",
                                "image": "blender.png"
                            }
                        ]
                    },
                    {
                        "number": 10,
                        "step": "Add brown sugar, to taste.",
                        "ingredients": [
                            {
                                "id": 19334,
                                "name": "brown sugar",
                                "localizedName": "brown sugar",
                                "image": "dark-brown-sugar.png"
                            }
                        ],
                        "equipment": []
                    },
                    {
                        "number": 11,
                        "step": "Blend or mix the chocolate and avocado mix through until you have a smooth, thick, pudding-like consistency.",
                        "ingredients": [
                            {
                                "id": 19081,
                                "name": "chocolate",
                                "localizedName": "chocolate",
                                "image": "milk-chocolate.jpg"
                            },
                            {
                                "id": 9037,
                                "name": "avocado",
                                "localizedName": "avocado",
                                "image": "avocado.jpg"
                            }
                        ],
                        "equipment": []
                    },
                    {
                        "number": 12,
                        "step": "Transfer the food processor bowl to the fridge for about 30 minutes.",
                        "ingredients": [],
                        "equipment": [
                            {
                                "id": 404771,
                                "name": "food processor",
                                "localizedName": "food processor",
                                "image": "food-processor.png"
                            },
                            {
                                "id": 404783,
                                "name": "bowl",
                                "localizedName": "bowl",
                                "image": "bowl.jpg"
                            }
                        ],
                        "length": {
                            "number": 30,
                            "unit": "minutes"
                        }
                    },
                    {
                        "number": 13,
                        "step": "After 30 minutes, check the consistency - if it is still too soft to handle, put in fridge for another 5-10 minutes. When solid enough to handle, scoop up a little bit of the stiffened chocolate with a teaspoon and roll it in your hands into a smooth ball.",
                        "ingredients": [
                            {
                                "id": 19081,
                                "name": "chocolate",
                                "localizedName": "chocolate",
                                "image": "milk-chocolate.jpg"
                            },
                            {
                                "id": 0,
                                "name": "roll",
                                "localizedName": "roll",
                                "image": "dinner-yeast-rolls.jpg"
                            }
                        ],
                        "equipment": [],
                        "length": {
                            "number": 40,
                            "unit": "minutes"
                        }
                    },
                    {
                        "number": 14,
                        "step": "Transfer the ball to the coating and roll it until it is completely covered.",
                        "ingredients": [
                            {
                                "id": 0,
                                "name": "roll",
                                "localizedName": "roll",
                                "image": "dinner-yeast-rolls.jpg"
                            }
                        ],
                        "equipment": []
                    },
                    {
                        "number": 15,
                        "step": "Place the covered ball on a tray or plate.",
                        "ingredients": [],
                        "equipment": []
                    },
                    {
                        "number": 16,
                        "step": "Place the chocolate truffles back in the fridge and keep it chilled until serving.",
                        "ingredients": [
                            {
                                "id": 0,
                                "name": "chocolate truffles",
                                "localizedName": "chocolate truffles",
                                "image": ""
                            }
                        ],
                        "equipment": []
                    }
                ]
            }
        ],
        "spoonacularSourceUrl": "https://spoonacular.com/avocado-chocolate-truffles-1697397",
        "nutrition": {
            "nutrients": [
                {
                    "name": "Calories",
                    "amount": 80.1966,
                    "unit": "kcal"
                }
            ]
        }
    };

    return (
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

                <div id="recipes-overview">
                    <RecipeCard recipe={ testRecipe }/>
                </div>
            </div>
        </PageContainer>
    );
}

export default Recipes;