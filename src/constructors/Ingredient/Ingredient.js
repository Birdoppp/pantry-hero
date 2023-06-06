function Ingredient(
    id,
    name,
    possibleUnits,
    unit,
    type,
    imagePath,
    amount,
    expiryDate,
) {
    // Constructor properties:
    this.id = id;
    this.Name = name;
    this.PossibleUnits = possibleUnits;
    this.Unit = unit;
    this.Type = type;
    this.ImagePath = imagePath;
    this.Amount = amount;
    this.ExpiryDate = new Date(expiryDate);

    // Methods:
    this.getExpiry = () => {
        if ( expiryDate ) {
            const today = new Date();
            const difference = this.ExpiryDate.getTime() - today.getTime();

            return Math.ceil(difference / (1000 * 3600 * 24));
        } else {
            return null;
        }
    };

    this.getImage = () => {
        return "https://spoonacular.com/cdn/ingredients_100x100/" + imagePath;
    }

    this.getAmount = () => {
        return this.Amount;
    };

    this.setAmount = (newAmount) => {
        this.Amount = newAmount;
    };
}

export default Ingredient;