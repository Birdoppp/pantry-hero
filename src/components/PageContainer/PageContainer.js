import React, { useState } from 'react';
import "./PageContainer.css";
import { ReactComponent as SearchIcon } from "../../assets/icon-search.svg";
import { ReactComponent as BackgroundImage } from "../../assets/icon-logo.svg"

function PageContainer({ title, searchPlaceHolder, onSearch, onEnterPress, children }) {
    const [ searchQuery, setSearchQuery ] = useState("");

    function handleInputChange ( e ) {
        setSearchQuery( e.target.value );
        onSearch( e.target.value );
    }

    function handleEnterPress( e ) {
        if ( onEnterPress && onEnterPress !== "undefined" ) {
            if (e.key === "Enter") {
                onEnterPress();
                setSearchQuery( "" );
            }
        }
    }

    return (
        <>
            <div className="outer-container page-container">

                <BackgroundImage className="background-image"/>

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
                            onKeyDown={ handleEnterPress }
                        />
                    </div>

                    <div className="balancer"></div>
                </div>
                { children }
            </div>
        </>
    );
}

export default PageContainer;