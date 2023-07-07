import React, {useEffect, useState, useContext } from 'react';
import { useMediaQuery } from "react-responsive";
import PageContainer from "../../components/PageContainer/PageContainer";
import Dashboard from "../../components/Dashboard/Dashboard";
import LoadingIcon from "../../components/LoadingIcon/LoadingIcon";
import RecipeCard from "../../components/RecipeCard/RecipeCard";
import DropDownMenu from "../../components/DropDownMenu/DropDownMenu";
import IngredientStatusBlock from "../../components/IngredientStatusBlock/IngredientStatusBlock";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";
import { adjustIngredientUnit, getIngredientInfoByName } from "../../features/API/Spoonacular";
import { matchRecipeListToPantry } from "../../helpers/matchRecipeListToPantry";
import { db } from "../../features/Database/db";
import { addItemToShoppingList } from "../../helpers/addItemToShoppingList";
import { allUnits } from "../pantry/Pantry";
import { ReactComponent as IconCheckList } from "../../assets/icon-checklist.svg"
import { HistoryContext } from "../../context/HistoryProvider";
import { SelectionContext } from "../../context/SelectionProvider";
import "./Selection.css"

function Selection() {
    const { historyState } = useContext( HistoryContext );
    const { selectionState } = useContext( SelectionContext )
    const [ recipesAreLoading, setRecipesAreLoading ] = useState(false);
    const [ unMatchingIngredients, setUnMatchingIngredients ] = useState( 0);
    const [ matchingIngredients, setMatchingIngredients ] = useState(0);

    const isMobile = useMediaQuery({ maxWidth: 600 })

    useEffect( () => {
        async function fetchIngredientsMatch() {
            const fullIngredientList = await getAllIngredients();
            const matchCheck = await matchRecipeListToPantry( fullIngredientList, db );

            setUnMatchingIngredients(matchCheck.unMatching);
            setMatchingIngredients(matchCheck.matching);
        }

        fetchIngredientsMatch().catch(console.error)
    }, [ selectionState ])

    function handleSearch() {
        console.log("Searching");
    }

    async function getAllIngredients() {
        const ingredientsList = [];

        for ( const recipe of selectionState ) {
            for ( const ingredient of recipe.ingredients ) {
                const existingIngredient = ingredientsList.find( item => item.name === ingredient.name )

                if ( existingIngredient ) {
                    if (existingIngredient.unit === ingredient.unit ) {
                        existingIngredient.amount += ingredient.amount;
                    } else {
                        const newAmount = await adjustIngredientUnit(ingredient, existingIngredient.unit);

                        existingIngredient.amount += newAmount;
                    }
                } else {
                    ingredientsList.push(ingredient);
                }
            }
        }

       return ingredientsList;
    }

    async function handleAddMissingIngredientsToShoppingList() {
        for ( const ingredient of unMatchingIngredients )  {
            const ingredientInfo = await getIngredientInfoByName( ingredient.name );

            if ( ingredientInfo.length > 0 ) {
                const { name, possibleUnits, aisle, image,  } = ingredientInfo[0];
                const { amount, unit } = ingredient;

                const intAmount = parseInt(amount);
                const type = aisle.split(";")[0];

                void addItemToShoppingList(
                    name,
                    unit,
                    possibleUnits,
                    type,
                    image,
                    intAmount,
                    null,
                    false
                )
            } else {
                const { name, amount, unit } = ingredient;
                const intAmount = parseInt(amount);

                void addItemToShoppingList(
                    name,
                    unit,
                    allUnits,
                    "Ingredient",
                    "",
                    intAmount,
                    null,
                    false
                )
            }
        }
    }

    return (
        <PageContainer
            title="My recipes"
            searchPlaceHolder="recipes"
            onSearch={ handleSearch }
            isMirrored={ true }
        >
            <div
                id="selection-overview"
                className="inner-container"
            >
                { isMobile ? (
                    <Dashboard className="dashboard">
                        <div id="quick-check-dashboard">
                            <h3>Quick check</h3>
                            <div id={"pantry-match-information"}>
                                <IconCheckList/>
                                <p>{ `${matchingIngredients.length}/${matchingIngredients.length + unMatchingIngredients.length} ingredients` }</p>
                            </div>

                            { unMatchingIngredients.length === 0 ? (
                                <p className="ingredient-notification">You have all ingredients to finish your selected recipes</p>
                            ) : (
                                <>
                                    <p className="ingredient-notification unmatched">You don't have all ingredients to finish your selected recipes</p>

                                    <DropDownMenu title="Show missing ingredients">
                                        { unMatchingIngredients &&
                                            unMatchingIngredients.map( ingredient  => (
                                                    <IngredientStatusBlock key={ ingredient.name } ingredient={ ingredient } isListItem={ true }/>
                                                )
                                            ) }
                                    </DropDownMenu>

                                    <Button
                                        type="button"
                                        textValue="Add missing ingredients to your list"
                                        filledStatus={ true }
                                        clickHandler={ handleAddMissingIngredientsToShoppingList }
                                    />
                                </>

                            ) }
                        </div>
                    </Dashboard>
                ) : (
                    <Link to="/recipes">
                        <button>To other page</button>
                    </Link>
                ) }


                <div id="selection-item-overview">
                    <h2 className="selection-title">My selection</h2>
                    <div id="selection-list-overview">
                        { recipesAreLoading ? (
                            <LoadingIcon/>
                        ) : (
                            selectionState &&
                            selectionState.length > 0 &&
                            selectionState.map(( recipe, index ) => (
                                <RecipeCard key={`recipe-${ index }`} recipe={ recipe } isSelection={ true } />
                            ))
                        ) }
                    </div>

                    <h2 className="selection-title">Recently cooked</h2>
                    <div id="selection-list-overview">
                        { recipesAreLoading ? (
                            <LoadingIcon/>
                        ) : (
                            historyState &&
                            historyState.length > 0 &&
                            historyState.map(( recipe, index ) => (
                                <RecipeCard key={`recipe-${ index }`} recipe={ recipe } />
                            ))
                        ) }
                    </div>
                </div>

                { isMobile ? (
                    <Link to="/recipes">
                        <button>To other page</button>
                    </Link>
                ) : (
                    <Dashboard className="dashboard">
                        <div id="quick-check-dashboard">
                            <h3>Quick check</h3>
                            <div id={"pantry-match-information"}>
                                <IconCheckList/>
                                <p>{ `${matchingIngredients.length}/${matchingIngredients.length + unMatchingIngredients.length} ingredients` }</p>
                            </div>

                            { unMatchingIngredients.length === 0 ? (
                                <p className="ingredient-notification">You have all ingredients to finish your selected recipes</p>
                            ) : (
                                <>
                                    <p className="ingredient-notification unmatched">You don't have all ingredients to finish your selected recipes</p>

                                    <DropDownMenu title="Show missing ingredients">
                                        { unMatchingIngredients &&
                                            unMatchingIngredients.map( ingredient  => (
                                                    <IngredientStatusBlock key={ ingredient.name } ingredient={ ingredient } isListItem={ true }/>
                                                )
                                            ) }
                                    </DropDownMenu>

                                    <Button
                                        type="button"
                                        textValue="Add missing ingredients to your list"
                                        filledStatus={ true }
                                        clickHandler={ handleAddMissingIngredientsToShoppingList }
                                    />
                                </>

                            ) }
                        </div>
                    </Dashboard>
                ) }
            </div>
        </PageContainer>
    );
}

export default Selection;