function ListItem (
    id,
    name,
    possibleUnits,
    unit,
    type,
    imagePath,
    amount,
    ingredientExpiresInDays,
    checked,
) {
    this.id = id;
    this.Name = name;
    this.PossibleUnits = possibleUnits;
    this.Unit = unit;
    this.Type = type;
    this.image = imagePath
    this.Amount = amount;
    this.IngredientExpiresInDays = ingredientExpiresInDays;
    this.Checked = checked;

    this.getAmount = () => {
        return this.Amount;
    }
}

export default ListItem;