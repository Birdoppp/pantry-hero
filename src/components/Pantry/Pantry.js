import React from 'react';
import { useForm } from 'react-hook-form';
import {options} from "axios";
import Ingredient from "../../constructors/Ingredient/Ingredient";

function Pantry() {
    const { register, handleSubmit, formState: { errors }, watch } = useForm( {mode: "onBlur"} );
    const watchSelectedReferrer = watch("found-through")
    const allUnits = [ "g", "l", "serving", "piece" ];

    // Test with Dexie Database:
    // async function addIngredient( ingredient ) {
    //     const name = ingredient.Name;
    //     const possibleUnits = ingredient.PossibleUnits;
    //     const unit = ingredient.Unit;
    //     const type = ingredient.Type;
    //     const imagePath = ingredient.ImagePath;
    //     const amount = ingredient.getAmount();
    //     const expiryDate = ingredient.ExpiryDate;
    //     const ingredientExpiryDays = ingredient.IngredientExpiryDays;
    //
    //     try{
    //         const id = await db.pantry.add( {
    //             name,
    //             possibleUnits,
    //             unit,
    //             type,
    //             imagePath,
    //             amount,
    //             expiryDate,
    //             ingredientExpiryDays
    //         } )
    //     } catch ( e ) {
    //         console.error( e )
    //     }
    // }

    function handleFormSubmit( data ) {
        // Adjust properties when linked to API
        const tmpIngredient = new Ingredient(
            data.name,
            allUnits,
            data.unit,
            "produce",
            (data.name + ".jpg"),
            data.amount,
            data.date,
            5
        )

        console.log(tmpIngredient)
    }

    return (
        <div>
            <form onSubmit={ handleSubmit( handleFormSubmit ) }>
                <input type="text"
                       id="input-name"
                       placeholder="name"
                       { ...register( "name", {

                       } ) }
                />

                <input type="number"
                       id="input-amount"
                       placeholder="amount"
                       { ...register( "amount", {

                       } ) }
                />

                <select id="input-unit"
                        {...register("unit")}>
                    { allUnits.map( (item, index) => {
                        return (<option key={index} value={item}>{item}</option>)
                    } ) }
                </select>

                <input type="date"
                       id="input-date"
                       { ...register( "expiryDate", {

                       } ) }
                />

                <button type="submit">add</button>
            </form>
        </div>
    );
};

export default Pantry;