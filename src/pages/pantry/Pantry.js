import React, { useEffect, useState } from "react";

// DEPENDENCIES
import { useForm } from "react-hook-form";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../features/Database/db";
import { fetchIngredientSuggestion, createAbortController } from "../../features/API/Spoonacular";

// COMPONENTS
import Button from "../../components/Button/Button";
import PantryItem from "../../components/PantryItem/PantryItem";
import Dashboard from "../../components/Dashboard/Dashboard";
import Checkbox from "../../components/Checkbox/Checkbox";
import Ingredient from "../../constructors/Ingredient/Ingredient";
import InformationTag from "../../components/InformationTag/InformationTag";
import FilterSelector from "../../components/FilterSelector/FilterSelector";
import PageContainer from "../../components/PageContainer/PageContainer";

// HELPERS
import { addIngredientToPantry } from "../../helpers/addIngredientToPantry";
import { formatNumber } from "../../helpers/formatNumber";
import { getExpiryItemsCount } from "../../helpers/getExpiryItemsCount";
import { handleSuggestionClick } from "../../helpers/handleSuggestionClick";
import { handleSorting } from "../../helpers/handleSorting";
import { debounce } from "../../helpers/debounce";

// STYLES
import "./Pantry.css"

export const allUnits = [ "package", "teaspoon", "tablespoon", "cup", "fluid ounce", "pint", "quart", "gallon", "ounce", "pound", "gram", "kilogram", "milliliter", "liter", "pinch", "dash", "drop", "sprig", "slice", "piece", "can", "bottle" ];

function Pantry() {
    // STATE
    const { register, reset, handleSubmit, setValue, formState: { errors }, watch } = useForm( {mode: "onSubmit"} );
    const [ isExpiryInfinite, setIsExpiryInfinite ] = useState(false);
    const [ expiryGoodCount, setExpiryGoodCount ] = useState(0);
    const [ expiryCloseCount, setExpiryCloseCount ] = useState(0);
    const [ expiredCount, setExpiredCount ] = useState(0);
    const [ sortOption, setSortOption ] = useState("A-Z");
    const [ sortedData, setSortedData ] = useState(null);
    const [ searchResults, setSearchResults ] = useState(null);
    const [ showErrorMessage, setShowErrorMessage ] = useState(false);

    // API:
    const [ suggestions, setSuggestions ] = useState([]);
    const [ isInputFocused, setIsInputFocused ] = useState(false);
    const [ showPopout, setShowPopout ] = useState(false);
    const [ ingredientUnits, setIngredientUnits ] = useState(allUnits);

    const debouncedInputChange = debounce( handleInputChange, 300 );
    const signal = createAbortController();

    // DATABASE UPDATER
    const myPantry = useLiveQuery(
        () => db.pantry.toArray()
    );

    // USE EFFECTS
    useEffect(() => {
        if ( myPantry ) {
            const sorted = [...myPantry].sort((a, b) => {
                if (sortOption === "type") {
                    return a.type.localeCompare(b.type);
                } else if (sortOption === "expiry") {
                    const dateA = a.expiryDate ? new Date(a.expiryDate) : null;
                    const dateB = b.expiryDate ? new Date(b.expiryDate) : null;

                    if (dateA === null && dateB === null) {
                        return 0;
                    } else if (dateA === null) {
                        return 1;
                    } else if (dateB === null) {
                        return -1;
                    } else {
                        return dateA - dateB;
                    }
                } else {
                    return a.name.localeCompare(b.name);
                }
            });
            setSortedData(sorted);
        }
    }, [myPantry, sortOption]);

    useEffect(() => {
        setExpiryGoodCount(getExpiryItemsCount(myPantry, 3));
    }, [myPantry]);

    useEffect(() => {
        setExpiryCloseCount(getExpiryItemsCount(myPantry, 3, 0));
    }, [myPantry]);

    useEffect(() => {
        setExpiredCount(getExpiryItemsCount(myPantry, 0));
    }, [myPantry]);

    useEffect(() => {
        if (showErrorMessage) {
            const timeout = setTimeout(() => {
                setShowErrorMessage(false);
            }, 3000);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [showErrorMessage]);

    // HANDLERS
    function handleCheckboxChange() {
        setIsExpiryInfinite( prev => !prev );
    }

    function handleFormSubmit( data ) {
        const amount = parseInt(data.amount);
        const expiry = data["infiniteExpiry"] ? null : data.expiryDate;
        const type = data.type ? data.type : "other";


        void addIngredientToPantry (
            data.name,
            data.unit,
            ingredientUnits,
            type,
            data.image,
            amount,
            expiry,
        );

        setIngredientUnits( allUnits );
        reset();
        setValue("infiniteExpiry", false);
        setIsExpiryInfinite( false );
    }

    function handleFormClear() {
        reset();
    }

    async function handleInputChange ( input ) {
        if ( input.trim() === "" ) {
            setSuggestions([]);
            setShowPopout(false);
        } else {
            const data = await fetchIngredientSuggestion( input, signal );
            setSuggestions( data );
            setShowPopout(data.length > 0 );
        }
    }

    async function searchIngredients( query ) {
        if ( query.trim() === "" ) {
            setSearchResults(null);
        } else {
            const results = await db.pantry
                .filter( item => item.name.toLowerCase().includes( query.toLowerCase() ) )
                .toArray();
            setSearchResults(results);
        }
    }


    // HTML ELEMENTS
    return (
        <PageContainer
            title="My pantry"
            searchPlaceHolder="ingredients"
            onSearch={ searchIngredients }
        >
            <div id="pantry-overview"
                 className="inner-container"
            >
                <Dashboard className="dashboard">
                    <>
                        <h3>Sort by:</h3>
                        <FilterSelector>
                            <button onClick={ () => handleSorting( setSortOption, "A-Z" ) }>A-Z</button>
                            <button onClick={ () => handleSorting( setSortOption, "expiry" ) }>expiry</button>
                            <button onClick={ () => handleSorting( setSortOption, "type" ) }>type</button>
                        </FilterSelector>
                    </>
                    <>
                        <h3>Status:</h3>
                        <div id="expiry-overview">
                            <InformationTag
                                title="Good"
                                displayNum={ formatNumber( expiryGoodCount ) }
                                expiryClass="expiry-green"
                            />

                            <InformationTag
                                title="Close"
                                displayNum={ formatNumber( expiryCloseCount ) }
                                expiryClass="expiry-orange"
                            />

                            <InformationTag
                                title="Expired"
                                displayNum={ formatNumber( expiredCount ) }
                                expiryClass="expiry-red"
                            />
                        </div>
                    </>
                    <>
                        <h3>Add ingredient:</h3>
                        <form id="pantry-add-item-form" onSubmit={ handleSubmit( handleFormSubmit ) }>
                            <div className="input-wrapper error-wrapper">
                                { errors.name && showErrorMessage && <p className="error-message">{ errors.name.message }</p> }
                                <input
                                    type="text"
                                    id="input-name"
                                    className={ showPopout && isInputFocused ? "show" : "" }
                                    placeholder="name"
                                    autoComplete="off"
                                    {...register("name", {
                                        onChange: ( e ) => {
                                            debouncedInputChange( e.target.value )
                                        },
                                        required: {
                                            value: true,
                                            message: "An ingredient name needs to be entered",
                                        },
                                    })}
                                    onBlur={ () => {
                                        setTimeout( () => { setIsInputFocused( false ) }, 200 );
                                    } }
                                    onFocus={ () => {
                                        setIsInputFocused( true );
                                    } }
                                />

                                {showPopout && isInputFocused && (
                                    <div className="suggestion-popout">
                                        {suggestions.map(( suggestion ) => (
                                            <React.Fragment key={ suggestion.id }>
                                                <div className="suggestion-divider" />
                                                <div
                                                    className="suggestion-item"
                                                    onClick={() => handleSuggestionClick( suggestion, setValue, setIngredientUnits, setSuggestions, setShowPopout )}
                                                >
                                                    { suggestion.name }
                                                </div>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div
                                id="form-amount-information"
                                className="error-wrapper"
                            >
                                { errors.amount && showErrorMessage && <p className="error-message">{ errors.amount.message }</p> }
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
                                        value={ watch("unit") }
                                        {...register("unit", {
                                            defaultValue: ingredientUnits[0],
                                        } ) }
                                >
                                    {ingredientUnits.map(( item ) => (
                                        <option key={ item } value={ item }>
                                            { item }
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <input type="date"
                                   id="input-date"
                                   disabled={ isExpiryInfinite }
                                   { ...register( "expiryDate" ) }
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
                                    clickHandler={ () => {
                                        if ( errors )  {
                                            setShowErrorMessage( true );
                                        }
                                    } }
                                    filledStatus={ true }
                                />
                            </div>
                        </form>
                    </>
                </Dashboard>


                <div id="ingredients-overview">
                    {  searchResults ?
                        searchResults.map(item => (
                            <PantryItem key={ item.id }
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
                        <PantryItem key={ item.id }
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
}

export default Pantry;