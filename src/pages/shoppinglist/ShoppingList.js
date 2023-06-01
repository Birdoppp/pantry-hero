import React, {useEffect, useState} from 'react';
import {useLiveQuery} from "dexie-react-hooks";
import {useForm} from "react-hook-form";
import {db} from "../../features/Database/db";
import {allUnits} from "../pantry/Pantry";
import {fetchIngredientSuggestion} from "../../features/API/Spoonacular";

import Button from "../../components/Button/Button";
import PageContainer from "../../components/PageContainer/PageContainer";
import Dashboard from "../../components/Dashboard/Dashboard";
import FilterSelector from "../../components/FilterSelector/FilterSelector";
import ListItem from "../../constructors/ListItem/ListItem";
import ShoppingItem from "../../components/ShoppingItem/ShoppingItem";
import Ingredient from "../../constructors/Ingredient/Ingredient";

import "./ShoppingList.css"

function ShoppingList(props) {
    const {register, reset, handleSubmit, setValue, formState: { errors }, watch} = useForm( {mode: "onBlur"} );
    const [sortOption, setSortOption] = useState("A-Z");
    const [sortedData, setSortedData] = useState(null);
    const [searchResults, setSearchResults] = useState(null);

    const [suggestions, setSuggestions] = useState([]);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [showPopout, setShowPopout] = useState(false);
    const [ingredientUnits, setIngredientUnits] = useState(allUnits);

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

    // DATABASE FUNCTIONS
    async function addItem( name, amount, unit, possibleUnits, type, imagePath ) {

        try{
            const id = await db.shoppinglist.add( {
                name,
                amount,
                unit,
                possibleUnits,
                type,
                imagePath
            } )
        } catch ( e ) {
            console.error( e )
        }
    }


    // HANDLERS
    function handleFormSubmit( data ) {
        const amount = parseInt(data.amount);
        const type = data.type ? data.type.split(";")[0] : "Other";

        void addItem (
            data.name,
            amount,
            data.unit,
            ingredientUnits,
            type,
            data.image
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

    const testItem = new ListItem(10, "testName", 500, "g", ["g", "oz"], "other");

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
                                        listItem={new Ingredient(
                                            item.id,
                                            item.name,
                                            item.possibleUnits,
                                            item.unit,
                                            item.type,
                                            item.imagePath,
                                            item.amount,
                                            item.expiryDate
                                        )}
                                    />
                                ))
                            ) : (
                                <>
                                    {sortOption === "type" && sortedData ? (
                                        sortedData.map((item, index) => (
                                            <React.Fragment key={item.id}>
                                                {index === 0 || item.type !== sortedData[index - 1].type ? (
                                                    <h3 className="type-title">{item.type}</h3>
                                                ) : null}
                                                <ShoppingItem
                                                    key={item.id}
                                                    listItem={new Ingredient(
                                                        item.id,
                                                        item.name,
                                                        item.possibleUnits,
                                                        item.unit,
                                                        item.type,
                                                        item.imagePath,
                                                        item.amount,
                                                        item.expiryDate
                                                    )}
                                                />
                                            </React.Fragment>
                                        ))
                                    ) : (sortedData && sortedData.map(item => (
                                            <ShoppingItem
                                                key={item.id}
                                                listItem={new Ingredient(
                                                    item.id,
                                                    item.name,
                                                    item.possibleUnits,
                                                    item.unit,
                                                    item.type,
                                                    item.imagePath,
                                                    item.amount,
                                                    item.expiryDate
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