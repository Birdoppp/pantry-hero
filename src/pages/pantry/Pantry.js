import React from 'react';
import { useForm } from 'react-hook-form';
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../features/Database/db";
import {useState} from "react";

import Button from "../../components/Button/Button";
import PantryItem from "../../components/PantryItem/PantryItem";
import Dashboard from "../../components/Dashboard/Dashboard";
import Checkbox from "../../components/Checkbox/Checkbox";
import Ingredient from "../../constructors/Ingredient/Ingredient";

import "./Pantry.css"



function Pantry() {
    // VARIABLES
    const { register, reset, handleSubmit, formState: { errors }, watch } = useForm( {mode: "onBlur"} );
    const [isExpiryInfinite, setIsExpiryInfinite] = useState(false);

    const allUnits = [ "piece", "slice", "fruit", "g", "oz", "cup", "serving" ];

    // DATABASE UPDATER
    const myPantry = useLiveQuery(
        () => db.pantry.toArray()
    );

    // DATABASE FUNCTIONS
    async function addIngredient( name, possibleUnits, unit, type, imagePath, amount, expiryDate, ingredientExpiryDays ) {

        try{
            const id = await db.pantry.add( {
                name,
                possibleUnits,
                unit,
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
            5
        );

        setIsExpiryInfinite( false );
        reset();
    }

    // HTML ELEMENTS
    return (
        <div id="pantry-overview">
            <Dashboard>
                <div>Child 1</div>
                <div>Child 2</div>
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
                                clickHandler={ () => {
                                    console.log( isExpiryInfinite ) } }
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
                { myPantry?.map(item => (
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
                                    item.ingredientExpiryDays,
                                )}
                    />
                ))}
            </div>
        </div>
    );
};

export default Pantry;