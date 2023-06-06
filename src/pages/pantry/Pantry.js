import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../features/Database/db";
import {fetchIngredientSuggestion} from "../../features/API/Spoonacular";

import Button from "../../components/Button/Button";
import PantryItem from "../../components/PantryItem/PantryItem";
import Dashboard from "../../components/Dashboard/Dashboard";
import Checkbox from "../../components/Checkbox/Checkbox";
import Ingredient from "../../constructors/Ingredient/Ingredient";
import InformationTag from "../../components/InformationTag/InformationTag";
import FilterSelector from "../../components/FilterSelector/FilterSelector";
import PageContainer from "../../components/PageContainer/PageContainer";

import "./Pantry.css"

export const allUnits = [ "package", "teaspoon", "tablespoon", "cup", "fluid ounce", "pint", "quart", "gallon", "ounce", "pound", "gram", "kilogram", "milliliter", "liter", "pinch", "dash", "drop", "sprig", "slice", "piece", "can", "bottle" ];

export async function addIngredientToPantry ( name, unit, possibleUnits, type, imagePath, amount, expiryDate ) {
    let ingredientExpiryDays = null;

    if ( expiryDate ) {
        const date = new Date(expiryDate)
        const today = new Date();
        const difference = date.getTime() - today.getTime();

        ingredientExpiryDays = Math.ceil(difference / (1000 * 3600 * 24));
    }

    try{
        const id = await db.pantry.add( {
            name,
            unit,
            possibleUnits,
            type,
            imagePath,
            amount,
            expiryDate,
            ingredientExpiryDays
        } )
    } catch ( e ) {
        console.error( e )
    }
}


function Pantry() {

    // VARIABLES
    const {register, reset, handleSubmit, setValue, formState: { errors }, watch} = useForm( {mode: "onBlur"} );
    const [isExpiryInfinite, setIsExpiryInfinite] = useState(false);
    const [expiryGoodCount, setExpiryGoodCount] = useState(0);
    const [expiryCloseCount, setExpiryCloseCount] = useState(0);
    const [expiredCount, setExpiredCount] = useState(0);

    const [sortOption, setSortOption] = useState("A-Z");
    const [sortedData, setSortedData] = useState(null);
    const [searchResults, setSearchResults] = useState(null);

    // API:
    const [suggestions, setSuggestions] = useState([]);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [showPopout, setShowPopout] = useState(false);
    const [ingredientUnits, setIngredientUnits] = useState(allUnits);

    // db.shoppinglist.clear();

    function formatNumber(number) {
        if ( number < 10 ) {
            return "0" + number;
        } else {
            return number;
        }
    }

    const searchIngredients = async (query) => {
        if (query.trim() === "") {
            setSearchResults(null);
        } else {
            const results = await db.pantry
                .filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
                .toArray();
            setSearchResults(results);
        }
    };

    // DATABASE UPDATER
    const myPantry = useLiveQuery(
        () => db.pantry.toArray()
    );

    // DATABASE EFFECTS
    useEffect(() => {
        if (myPantry) {
            const sorted = [...myPantry].sort((a, b) => {
                if (sortOption === "type") {
                    return a.type.localeCompare(b.type);
                } else if (sortOption === "expiry") {
                    const dateA = new Date(a.expiryDate);
                    const dateB = new Date(b.expiryDate);

                    return dateA - dateB;
                } else {
                    return a.name.localeCompare(b.name);
                }
            });
            setSortedData(sorted);
        }
    }, [myPantry, sortOption]);

    useEffect(() => {
        setExpiryGoodCount(getExpiryItemsCount(3));
    }, [myPantry]);

    useEffect(() => {
        setExpiryCloseCount(getExpiryItemsCount(3, 0));
    }, [myPantry]);

    useEffect(() => {
        setExpiredCount(getExpiryItemsCount(0));
    }, [myPantry]);

    // DATABASE FUNCTIONS
    function getExpiryItemsCount( offset, checkDate ) {
        return myPantry?.filter((item) => {
            if (item.expiryDate || item.expiryDate === 0) {
                if ( checkDate || checkDate === 0 ) {
                    return item.expiryDate <= getExpiryString(offset) && item.expiryDate > getExpiryString(checkDate)
                } else if ( offset === 0 ) {
                    return item.expiryDate <= getExpiryString(offset);
                } else {
                    return item.expiryDate > getExpiryString(offset);
                }
            }
        }).length;
    }

    // HANDLERS
    function handleCheckboxChange() {
        setIsExpiryInfinite( prev => !prev );
    }

    function handleFormSubmit( data ) {
        const amount = parseInt(data.amount);
        const expiry = data.infiniteExpiry ? null : data.expiryDate;

        void addIngredientToPantry(
            data.name,
            data.unit,
            ingredientUnits,
            data.type,
            data.image,
            amount,
            expiry,
        );

        setIsExpiryInfinite( false );
        setIngredientUnits( allUnits );
        reset();
    }

    function handleFormClear() {
        reset();
    }

    function getExpiryString( offSet ) {
        const today = new Date();
        today.setDate( today.getDate() + offSet );

        return today.toISOString().split("T")[0];
    }


    function handleSortByAZ() {
        setSortOption("A-Z");
    }

    function handleSortByExpiry() {
        setSortOption("expiry");
    }

    function handleSortByType() {
        setSortOption("type");
    }

    function handleSuggestionClick(suggestion) {
        setValue("name", suggestion.name);
        setValue("unit", suggestion.possibleUnits[0]);
        setValue("type", suggestion.aisle);
        setValue("image", suggestion.image);
        setIngredientUnits( suggestion.possibleUnits );

        setSuggestions([]);
        setShowPopout(false);
    }


    // HTML ELEMENTS
    return (
        <PageContainer
            title="My pantry"
            searchPlaceHolder="ingredients"
            onSearch={ searchIngredients }
        >
            <div id="pantry-overview"
                 className="inner-container">
                <Dashboard className="dashBoard">
                    <div>
                        <h3>Sort by:</h3>
                        <FilterSelector>
                            <button onClick={ handleSortByAZ }>A-Z</button>
                            <button onClick={ handleSortByExpiry }>expiry</button>
                            <button onClick={ handleSortByType }>type</button>
                        </FilterSelector>

                    </div>
                    <div>
                        <h3>Status:</h3>
                        <div id="expiry-overview">
                            <InformationTag
                                title="Good"
                                displayNum={ formatNumber(expiryGoodCount) }
                                expiryClass="expiry-green"
                            />

                            <InformationTag
                                title="Close"
                                displayNum={ formatNumber(expiryCloseCount) }
                                expiryClass="expiry-orange"
                            />

                            <InformationTag
                                title="Expired"
                                displayNum={ formatNumber(expiredCount) }
                                expiryClass="expiry-red"
                            />
                        </div>
                    </div>
                    <div>
                        <h3>Add ingredient:</h3>
                        <form id="pantry-add-item-form" onSubmit={ handleSubmit( handleFormSubmit ) }>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    id="input-name"
                                    className={ showPopout && isInputFocused ? "show" : "" }
                                    placeholder="name"
                                    autoComplete="off"
                                    {...register("name", {
                                        onChange: (e) => {
                                            void fetchIngredientSuggestion(e.target.value, setSuggestions, setShowPopout);
                                        },
                                        required: {
                                            value: true,
                                            message: "An ingredient name needs to be entered",
                                        },
                                    })}
                                    onBlur={ () => {
                                        setTimeout( () => {setIsInputFocused(false)}, 200 );
                                    } }
                                    onFocus={ () => {
                                        setIsInputFocused(true);
                                    } }
                                />
                                {showPopout && isInputFocused && (
                                    <div className="suggestion-popout">
                                        {suggestions.map((suggestion) => (
                                            <React.Fragment key={suggestion.id}>
                                                <div className="suggestion-divider" />
                                                <div
                                                    className="suggestion-item"
                                                    onClick={() => handleSuggestionClick(suggestion)}
                                                >
                                                    {suggestion.name}
                                                </div>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div id="form-amount-information">
                                <input type="number"
                                       id="input-amount"
                                       placeholder="amount"
                                       { ...register( "amount", {
                                           required: {
                                               value: true,
                                               message: "Enter at least one"
                                           }
                                       } ) }
                                />

                                <select id="input-unit"
                                        value={watch("unit")}
                                        {...register("unit", {
                                            defaultValue: ingredientUnits[0],
                                        } ) }
                                >
                                    {ingredientUnits.map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <input type="date"
                                   id="input-date"
                                   disabled={ isExpiryInfinite }
                                   { ...register( "expiryDate", {

                                   } ) }
                            />

                            <div id="check-no-expiry">
                                <Checkbox
                                    checked={ isExpiryInfinite }
                                    clickHandler={ handleCheckboxChange }
                                    registerHandler={ register( "infiniteExpiry" ) }
                                    isLarge={ false }
                                />

                                <span id="expiry-text">Ingredient does not expire</span>
                            </div>

                            <div id="form-handler-buttons">
                                <Button
                                    textValue="clear"
                                    type="submit"
                                    clickHandler={ handleFormClear }
                                    filledStatus={ false }
                                />

                                <Button
                                    textValue="add"
                                    type="submit"
                                    filledStatus={ true }
                                />
                            </div>
                        </form>
                    </div>
                </Dashboard>


                <div id="ingredients-overview">
                    {  searchResults ?
                        searchResults.map(item => (
                            <PantryItem key={item.id}
                                        ingredient={ new Ingredient (
                                            item.id,
                                            item.name,
                                            item.possibleUnits,
                                            item.unit,
                                            item.type,
                                            item.imagePath,
                                            item.amount,
                                            item.expiryDate,
                                        )}
                            />
                        )) : sortedData && sortedData.map(item => (
                        <PantryItem key={item.id}
                                    ingredient={ new Ingredient (
                                        item.id,
                                        item.name,
                                        item.possibleUnits,
                                        item.unit,
                                        item.type,
                                        item.imagePath,
                                        item.amount,
                                        item.expiryDate,
                                    )}
                        />
                    ))}
                </div>
            </div>
        </PageContainer>

    );
};


export default Pantry;