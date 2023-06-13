import React, { useState } from 'react';
import "./PageContainer.css";
import { ReactComponent as SearchIcon } from "../../assets/icon-search.svg";

function PageContainer({ title, searchPlaceHolder, onSearch, children }) {
    const [ searchQuery, setSearchQuery ] = useState("");

    function handleInputChange ( e ) {
        setSearchQuery(e.target.value);
        onSearch(e.target.value);
    }

    return (
        <div className="outer-container page-container">
            <div id="page-navigation">
                <h1 className="title">{ title }</h1>

                <div className="search-bar-container">
                    <SearchIcon className="search-icon" />
                    <input
                        className="search-bar"
                        type="text"
                        value={ searchQuery }
                        onChange={ handleInputChange }
                        placeholder={ searchPlaceHolder }
                    />
                </div>
            </div>
            { children }
        </div>
    );
}

export default PageContainer;