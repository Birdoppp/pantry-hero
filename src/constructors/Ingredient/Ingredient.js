import React from "react";

function Ingredient (name, possibleUnits, unit, type, imagePath, amount, expiryDate, ingredientExpiryDays) {
    // Constructor properties:
    this.Name = name;
    this.PossibleUnits = possibleUnits;
    this.Unit = unit;
    this.Type = type;
    this.ImagePath = "https://spoonacular.com/cdn/ingredients_100x100/" + imagePath;
    this.ExpiryDate = expiryDate;
    this.IngredientExpiryDays = ingredientExpiryDays;

    const [amountState, setAmountState] = React.useState(amount);

    // Methods:
    this.getExpiry = () => {
        const today = new Date();
        const difference = this.ExpiryDate - today;

        return Math.ceil(difference / (1000 * 3600 * 24));
    }

    this.getAmount = () => {
        return amountState;
    }

    this.setAmount = (newAmount) => {
        console.log(`setting ${newAmount} as amount`)
        setAmountState(newAmount);
    }
}

export default Ingredient;