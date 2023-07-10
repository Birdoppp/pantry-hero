import React, { createContext, useState } from "react";

// HELPERS
import {getParsedSelection} from "../helpers/getParsedSelection";

export const SelectionContext = createContext( null );

function SelectionContextProvider({ children }) {
    const [ selectionState, setSelectionState ] = useState( getParsedSelection )

    const data = {
        selectionState,
        setSelectionState
    };

    return  (
        <SelectionContext.Provider value={ data }>
            { children }
        </SelectionContext.Provider>
    );
}

export default SelectionContextProvider;