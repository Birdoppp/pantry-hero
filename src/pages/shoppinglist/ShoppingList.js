import React, {useEffect, useState} from 'react';
import {useLiveQuery} from "dexie-react-hooks";
import { useForm } from "react-hook-form";
import { db, checkIfEntryExists, getCheckedItems } from "../../features/Database/db";
import { allUnits } from "../pantry/Pantry";
import { createAbortController, fetchIngredientSuggestion } from "../../features/API/Spoonacular";
import { addIngredientToPantry } from "../../helpers/addIngredientToPantry";
import { addItemToShoppingList } from "../../helpers/addItemToShoppingList";
import { handleConfirmation } from "../../helpers/handleConfirmation";
import { handleSuggestionClick } from "../../helpers/handleSuggestionClick";
import { handleSorting } from "../../helpers/handleSorting";
import { debounce } from "../../helpers/debounce";

import Button from "../../components/Button/Button";
import PageContainer from "../../components/PageContainer/PageContainer";
import Dashboard from "../../components/Dashboard/Dashboard";
import FilterSelector from "../../components/FilterSelector/FilterSelector";
import ListItem from "../../constructors/ListItem/ListItem";
import ShoppingItem from "../../components/ShoppingItem/ShoppingItem";

import "./ShoppingList.css"
import Popup from "../../components/Popup/Popup";


function ShoppingList() {
    const { register, reset, handleSubmit, setValue, formState: { errors }, watch} = useForm( {mode: "onBlur"} );
    const [ sortOption, setSortOption ] = useState("A-Z");
    const [ sortedData, setSortedData ] = useState(null);
    const [ searchResults, setSearchResults ] = useState(null);
    const [ suggestions, setSuggestions ] = useState([]);
    const [ isInputFocused, setIsInputFocused ] = useState(false);
    const [ showPopout, setShowPopout ] = useState(false);
    const [ ingredientUnits, setIngredientUnits ] = useState(allUnits);
    const [ hasCheckedItem, setHasCheckedItem ] = useState( false);
    const [ showAddToPantryPopup, setShowAddToPantryPopup ] = useState(false);
    const [ pantryItemDates, setPantryItemDates ] = useState({});

    const debouncedInputChange = debounce( handleInputChange, 500 );
    const signal = createAbortController();

    const searchItems = async (query) => {
        if (query.trim() === "") {
            setSearchResults(null);
        } else {
            const results = await db.shoppinglist
                .filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
                .toArray();
            setSearchResults(results);
        }
    };

    const myShoppingList = useLiveQuery(
        () => db.shoppinglist.toArray()
    );

    // DATABASE EFFECTS
    useEffect(() => {
        if (myShoppingList) {
            const sorted = [...myShoppingList].sort((a, b) => {
                if (sortOption === "type") {
                    return a.type.localeCompare(b.type);
                }  else {
                    return a.name.localeCompare(b.name);
                }
            });
            setSortedData(sorted);
        }
    }, [myShoppingList, sortOption]);

    useEffect( () => {
        if (myShoppingList) {
            checkIfEntryExists( db.shoppinglist, "checked", true).then( (data) => setHasCheckedItem(data));
        }
    }, [myShoppingList])

    useEffect(() => {
        const currentDate = new Date().toISOString().split('T')[0];

        if (sortedData) {
            const updatedDates = sortedData.reduce((dates, item) => {
                if (item.checked && item.type !== "Other") {
                    if (item.ingredientExpiresInDays !== null) {
                        const expiresInDays = item.ingredientExpiresInDays || 0;
                        const expirationDate = new Date();

                        expirationDate.setDate(expirationDate.getDate() + expiresInDays);
                        const formattedExpirationDate = expirationDate.toISOString().split('T')[0];

                        dates[item.id] = formattedExpirationDate || currentDate;
                    } else {
                        dates[item.id] = null;
                    }
                }
                return dates;
            }, {});

            setPantryItemDates(updatedDates);
        }
    }, [sortedData]);

    // HANDLERS
    function handleFormSubmit( data ) {
        const amount = parseInt(data.amount);
        const type = data.type ? data.type.split(";")[0] : "Other";

        void addItemToShoppingList (
            data.name,
            data.unit,
            ingredientUnits,
            type,
            data.image,
            amount,
            null,
            false
        );

        setIngredientUnits( allUnits );
        reset();
    }

    function handleFormClear() {
        reset();
    }

    function handleDateChange(itemId, date) {
        setPantryItemDates((prevDates) => ({
            ...prevDates,
            [itemId]: date
        }));
    }

    async function handleCheckedItemsToPantry() {
        try {
            const checkedItems = await getCheckedItems();

            for (const item of checkedItems) {
                if (item.type !== "Other") {
                    const date = pantryItemDates[item.id];
                    await addIngredientToPantry(
                        item.name,
                        item.unit,
                        item.possibleUnits,
                        item.type,
                        item.imagePath,
                        item.amount,
                        date
                    );
                }

                await db.shoppinglist.delete(item.id);
            }
        } catch ( e ) {
            console.error( e );
        }
    }

    async function handleInputChange ( input ) {
        if (input.trim() === '') {
            setSuggestions([]);
            setShowPopout(false);
        } else {
            const data = await fetchIngredientSuggestion(input, signal);
            setSuggestions(data);
            setShowPopout(data.length > 0);
        }
    }

    return (
        <div>
            <PageContainer
                title="Shopping list"
                searchPlaceHolder="items"
                onSearch={ searchItems }
            >
                <div
                    id="shoppinglist-overview"
                    className="inner-container"
                >
                    <Dashboard className="dashboard">
                        <div>
                            <h3>Sort by:</h3>
                            <FilterSelector>
                                <button onClick={ () => handleSorting( setSortOption, "A-Z") }>A-Z</button>
                                <button onClick={ () => handleSorting( setSortOption, "type") }>type</button>
                            </FilterSelector>
                        </div>

                        {hasCheckedItem && (
                            <div>
                                <Button
                                    textValue="Add checked items to pantry"
                                    type="button"
                                    clickHandler={ () => {
                                        setShowAddToPantryPopup( true )
                                    } }
                                    filledStatus={ true }
                                />
                            </div>
                        )}

                        <div>
                            <h3>Add item:</h3>
                            <form id="shopping-add-item-form" onSubmit={ handleSubmit( handleFormSubmit ) }>
                                <div className="input-wrapper error-wrapper">
                                    { errors.name && <p className="error-message">{ errors.name.message }</p> }
                                    <input
                                        type="text"
                                        id="input-name"
                                        className={ showPopout && isInputFocused ? "show" : "" }
                                        placeholder="name"
                                        autoComplete="off"
                                        {...register("name", {
                                            onChange: ( e ) => {
                                                debouncedInputChange( e.target.value );
                                            },
                                            required: {
                                                value: true,
                                                message: "An item name needs to be entered",
                                            },
                                        })}
                                        onBlur={() => {
                                            setTimeout( () => {setIsInputFocused( false )}, 200 );
                                        }}
                                        onFocus={() => {
                                            setIsInputFocused( true );
                                        }}
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
                                    { errors.amount && <p className="error-message">{ errors.amount.message }</p> }
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
                                        {ingredientUnits.map(( item ) => (
                                            <option key={ item } value={ item }>
                                                { item }
                                            </option>
                                        ))}
                                    </select>
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

                    <div id="list-items-overview">
                        {searchResults ? (
                            searchResults.map(item => (
                                <ShoppingItem
                                    key={ item.id }
                                    listItem={new ListItem(
                                        item.id,
                                        item.name,
                                        item.possibleUnits,
                                        item.unit,
                                        item.type,
                                        item.imagePath,
                                        item.amount,
                                        item.ingredientExpiresInDays,
                                        item.checked
                                    )}
                                />
                            ))
                        ) : (
                            <>
                                {sortOption === "type" && sortedData ? (
                                    sortedData.map((item, index) => (
                                        <React.Fragment key={ item.id }>
                                            {index === 0 || item.type !== sortedData[index - 1].type ? (
                                                <h3 className="type-title">{item.type.split(";")[0]}</h3>
                                            ) : null}
                                            <ShoppingItem
                                                key={ item.id }
                                                listItem={new ListItem(
                                                    item.id,
                                                    item.name,
                                                    item.possibleUnits,
                                                    item.unit,
                                                    item.type,
                                                    item.imagePath,
                                                    item.amount,
                                                    item.ingredientExpiresInDays,
                                                    item.checked
                                                )}
                                            />
                                        </React.Fragment>
                                    ))
                                ) : (sortedData && sortedData.map(item => (
                                        <ShoppingItem
                                            key={ item.id }
                                            listItem={new ListItem(
                                                item.id,
                                                item.name,
                                                item.possibleUnits,
                                                item.unit,
                                                item.type,
                                                item.imagePath,
                                                item.amount,
                                                item.ingredientExpiresInDays,
                                                item.checked
                                            )}
                                        />
                                    ))
                                )}
                            </>
                        )}
                    </div>
                </div>
            </PageContainer>

            {showAddToPantryPopup && (
                <Popup
                    onConfirm={ () => {
                        handleConfirmation(
                            true,
                            setShowAddToPantryPopup,
                            handleCheckedItemsToPantry
                        )
                    } }
                    onCancel={ () => {
                        handleConfirmation(
                            false,
                            setShowAddToPantryPopup
                        )
                    } }>
                    <h3>Enter expiry dates:</h3>
                    {sortedData &&
                        sortedData
                            .filter( ( item ) => item.checked && item.type !== "Other" )
                            .map(( item ) => (
                                <div
                                    className="listed-input"
                                    key={ item.id }>
                                    <hr/>
                                    <p>{ item.name.charAt(0).toUpperCase() + item.name.slice(1) }:</p>
                                    <input
                                        type="date"
                                        value={pantryItemDates[item.id] || ""}
                                        onChange={( e ) => handleDateChange( item.id, e.target.value )}
                                    />
                                </div>
                            ))}
                </Popup>
            )}
        </div>
    );
}

export default ShoppingList;