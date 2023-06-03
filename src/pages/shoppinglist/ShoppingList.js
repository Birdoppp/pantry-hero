import React, {useEffect, useState} from 'react';
import {useLiveQuery} from "dexie-react-hooks";
import {useForm} from "react-hook-form";
import {db, checkIfEntryExists} from "../../features/Database/db";
import {allUnits} from "../pantry/Pantry";
import {fetchIngredientSuggestion} from "../../features/API/Spoonacular";
import {addIngredientToPantry} from "../pantry/Pantry";

import Button from "../../components/Button/Button";
import PageContainer from "../../components/PageContainer/PageContainer";
import Dashboard from "../../components/Dashboard/Dashboard";
import FilterSelector from "../../components/FilterSelector/FilterSelector";
import ListItem from "../../constructors/ListItem/ListItem";
import ShoppingItem from "../../components/ShoppingItem/ShoppingItem";

import "./ShoppingList.css"

export async function addItemToShoppingList( name, unit, possibleUnits, type, imagePath, amount, ingredientExpiresInDays, checked ) {

    try{
        const id = await db.shoppinglist.add( {
            name,
            unit,
            possibleUnits,
            type,
            imagePath,
            amount,
            ingredientExpiresInDays,
            checked
        } )
    } catch ( e ) {
        console.error( e )
    }
}

function ShoppingList() {
    const {register, reset, handleSubmit, setValue, formState: { errors }, watch} = useForm( {mode: "onBlur"} );
    const [sortOption, setSortOption] = useState("A-Z");
    const [sortedData, setSortedData] = useState(null);
    const [searchResults, setSearchResults] = useState(null);

    const [suggestions, setSuggestions] = useState([]);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [showPopout, setShowPopout] = useState(false);
    const [ingredientUnits, setIngredientUnits] = useState(allUnits);
    const [hasCheckedItem, setHasCheckedItem] = useState( false)

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


    // DATABASE FUNCTIONS

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
        console.log(db.s)
        reset();
    }

    const handleSortByAZ = () => {
        setSortOption("A-Z");
    };

    const handleSortByType = () => {
        setSortOption("type");
    };

    function handleSuggestionClick(suggestion) {
        setValue("name", suggestion.name);
        setValue("unit", suggestion.possibleUnits[0]);
        setValue("type", suggestion.aisle);
        setValue("image", suggestion.image);
        setIngredientUnits(suggestion.possibleUnits);

        setSuggestions([]);
        setShowPopout(false);
    }

    async function handleCheckedItemsToPantry () {
        try {
            const items = await db.shoppinglist.toArray();

            items.map( (item) => {
                if (item.checked === true) {
                    if (item.type !== "Other") {
                        console.log(item)
                        addIngredientToPantry(
                            item.name,
                            item.unit,
                            item.possibleUnits,
                            item.type,
                            item.imagePath,
                            item.amount,
                        );
                    }

                    db.shoppinglist.delete(item.id);
                }
            } )
        } catch ( e ) {
            console.error( e );
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
                                <button onClick={ handleSortByAZ }>A-Z</button>
                                <button onClick={ handleSortByType }>type</button>
                            </FilterSelector>
                        </div>

                        {hasCheckedItem && (
                            <div>
                                <Button
                                    textValue="Add checked items to pantry"
                                    type="button"
                                    clickHandler={ handleCheckedItemsToPantry }
                                    filledStatus={ true }
                                />
                            </div>
                        )}

                        <div>
                            <h3>Add item:</h3>
                            <form id="shopping-add-item-form" onSubmit={ handleSubmit( handleFormSubmit ) }>
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
                                                message: "An item name needs to be entered",
                                            },
                                        })}
                                        onBlur={() => {
                                            setTimeout( () => {setIsInputFocused(false)}, 200 );
                                        }}
                                        onFocus={() => {
                                            setIsInputFocused(true);
                                        }}
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
                                    key={item.id}
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
                                        <React.Fragment key={item.id}>
                                            {index === 0 || item.type !== sortedData[index - 1].type ? (
                                                <h3 className="type-title">{item.type.split(";")[0]}</h3>
                                            ) : null}
                                            <ShoppingItem
                                                key={item.id}
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
                                            key={item.id}
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
        </div>
    );
}

export default ShoppingList;