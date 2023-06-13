export function handleSuggestionClick( suggestion, setValue, setUnits, setSuggestions, setShowPopout ) {
    setValue("name", suggestion.name);
    setValue("unit", suggestion.possibleUnits[0]);
    setValue("type", suggestion.aisle);
    setValue("image", suggestion.image);
    setUnits( suggestion.possibleUnits );

    setSuggestions( [] );
    setShowPopout( false );
}