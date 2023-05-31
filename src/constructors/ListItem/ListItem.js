import React from 'react';

function ListItem(
    id,
    name,
    amount,
    unit,
    possibleUnits,
    type,
    checked,
) {
    this.id = id;
    this.Name = name;
    this.Amount = amount;
    this.Unit = unit;
    this.PossibleUnits = possibleUnits;
    this.Type = type;
    this.Checked = checked;

    this.getAmount = () => {
        return this.Amount;
    }
}

export default ListItem;