import React, { createContext, useState } from "react";
import { getParsedHistory } from "../helpers/getParsedHistory";

export const HistoryContext = createContext( null );

function HistoryContextProvider({ children }) {
    const [ historyState, setHistoryState ] = useState( getParsedHistory )

    const data = {
        historyState,
        setHistoryState
    };

    return  (
        <HistoryContext.Provider value={ data }>
            { children }
        </HistoryContext.Provider>
    );
}

export default HistoryContextProvider;