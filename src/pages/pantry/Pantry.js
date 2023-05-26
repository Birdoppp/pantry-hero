import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../features/Database/db";

import Button from "../../components/Button/Button";
import PantryItem from "../../components/PantryItem/PantryItem";
import Dashboard from "../../components/Dashboard/Dashboard";
import Checkbox from "../../components/Checkbox/Checkbox";
import Ingredient from "../../constructors/Ingredient/Ingredient";
import InformationTag from "../../components/InformationTag/InformationTag";

import "./Pantry.css"
import FilterSelector from "../../components/FilterSelector/FilterSelector";

function Pantry() {
    // VARIABLES
    const { register, reset, handleSubmit, formState: { errors }, watch } = useForm( {mode: "onBlur"} );
    const [isExpiryInfinite, setIsExpiryInfinite] = useState(false);
    const [expiryGoodCount, setExpiryGoodCount] = useState(0);
    const [expiryCloseCount, setExpiryCloseCount] = useState(0);
    const [expiredCount, setExpiredCount] = useState(0);


    const [sortOption, setSortOption] = useState("A-Z");
    const [sortedData, setSortedData] = useState(null);

    const allUnits = [ "piece", "slice", "fruit", "g", "oz", "cup", "serving" ];

    function formatNumber(number) {
        if ( number < 10 ) {
            return "0" + number;
        } else {
            return number;
        }
    }

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
    async function addIngredient( name, possibleUnits, unit, type, imagePath, amount, expiryDate ) {

        try{
            const id = await db.pantry.add( {
                name,
                possibleUnits,
                unit,
                type,
                imagePath,
                amount,
                expiryDate
            } )
        } catch ( e ) {
            console.error( e )
        }
    }

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
    const handleCheckboxChange = () => {
        setIsExpiryInfinite( prev => !prev );
    };

    function handleFormSubmit( data ) {
        const amount = parseInt(data.amount);
        const expiry = data.infiniteExpiry ? null : data.expiryDate;

        addIngredient(
            data.name,
            allUnits,
            data.unit,
            "Produce",
            (data.name.toLowerCase() + ".jpg"),
            amount,
            expiry,
        );

        setIsExpiryInfinite( false );
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


    const handleSortByAZ = () => {
        setSortOption("A-Z");
    };

    const handleSortByExpiry = () => {
        setSortOption("expiry");
    };

    const handleSortByType = () => {
        setSortOption("type");
    };

    // HTML ELEMENTS
    return (
        <div id="pantry-overview">
            <Dashboard>
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
                        <input type="text"
                               id="input-name"
                               placeholder="name"
                               autoComplete="off"
                               { ...register( "name", {
                                   required: {
                                       value: true,
                                       message: "An ingredient name needs to be entered"
                                   }
                               } ) }
                        />

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
                                    {...register("unit")}>
                                { allUnits.map( (item, index) => {
                                    return (<option key={index} value={item}>{item}</option>)
                                } ) }
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
                                id="input-no-expiry"
                                checked={ isExpiryInfinite }
                                clickHandler={ handleCheckboxChange }
                                registerHandler={ register( "infiniteExpiry" ) }
                            />

                            <span>Ingredient does not expire</span>
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
                {  sortedData && sortedData.map(item => (
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
    );
};

export default Pantry;