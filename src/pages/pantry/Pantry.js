import React from 'react';
import { useForm } from 'react-hook-form';
import {options} from "axios";
import Ingredient from "../../constructors/Ingredient/Ingredient";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../features/Database/db";
import PantryItem from "../../components/PantryItem/PantryItem";

function Pantry() {
    const { register, handleSubmit, formState: { errors }, watch } = useForm( {mode: "onBlur"} );
    //const watchSelectedReferrer = watch("found-through");
    const allUnits = [ "piece", "slice", "fruit", "g", "oz", "cup", "serving" ];

    const myPantry = useLiveQuery(
        () => db.pantry.toArray()
    );

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

    function handleFormSubmit( data, e ) {
        const amount = parseInt(data.amount);

        addIngredient(
            data.name,
            allUnits,
            data.unit,
            "Produce",
            (data.name.toLowerCase() + ".jpg"),
            amount,
            data.expiryDate,
            5
        );

        e.target.reset();
    }

    return (
        <div>
            <form onSubmit={ handleSubmit( handleFormSubmit ) }>
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

                <input type="date"
                       id="input-date"
                       { ...register( "expiryDate", {

                       } ) }
                />

                <button type="submit">add</button>

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
            </form>
        </div>
    );
};

export default Pantry;