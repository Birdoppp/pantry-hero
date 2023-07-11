import React, { useState } from 'react';

// IMAGES
import { ReactComponent as SearchIcon } from "../../assets/icon-search.svg";
import { ReactComponent as BackgroundImage } from "../../assets/icon-logo.svg"

// STYLES
import "./PageContainer.css";

function PageContainer({ title, searchPlaceHolder, onSearch, onEnterPress, isMirrored, children }) {
    const [ searchQuery, setSearchQuery ] = useState("");

    // HANDLERS
    function handleInputChange ( e ) {
        setSearchQuery( e.target.value );
        onSearch( e.target.value );
    }

    function handleEnterPress( e ) {
        if ( onEnterPress && onEnterPress !== "undefined" ) {
            if ( e.key === "Enter" ) {
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
                    { isMirrored ? (
                        <div className="balancer"></div>
                    ) : (
                        <h1 className="title">{ title }</h1>
                    ) }

                    { !isMirrored &&
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
                    }

                    { isMirrored ? (
                        <h1 className="title">{ title }</h1>
                    ) : (
                        <div className="balancer"></div>
                    ) }
                </div>
                { children }
            </div>
        </>
    );
}

export default PageContainer;