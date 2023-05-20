import React from "react";

function Ingredient(
    id,
    name,
    possibleUnits,
    unit,
    type,
    imagePath,
    amount,
    expiryDate,
    ingredientExpiryDays,
) {
    // Constructor properties:
    this.id = id;
    this.Name = name;
    this.PossibleUnits = possibleUnits;
    this.Unit = unit;
    this.Type = type;
    this.ImagePath =
        "https://spoonacular.com/cdn/ingredients_100x100/" + imagePath;
    this.Amount = amount;
    this.ExpiryDate = new Date(expiryDate);
    this.IngredientExpiryDays = ingredientExpiryDays;

    // Methods:
    this.getExpiry = () => {
        const today = new Date();
        const difference = this.ExpiryDate.getTime() - today.getTime();

        return Math.ceil(difference / (1000 * 3600 * 24));
    };

    this.getAmount = () => {
        return this.Amount;
    };

    this.setAmount = (newAmount) => {
        this.Amount = newAmount;
    };
}

export default Ingredient;