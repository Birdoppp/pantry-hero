import React, {useState} from 'react';
import "./PageContainer.css"

function PageContainer( { title, searchPlaceHolder, onSearch, children }) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <div className="outer-container page-container">
            <div id="page-navigation">
                <h1 className="title">{title}</h1>

                <input
                    className="search-bar"
                    type="text"
                    value={searchQuery}
                    onChange={ handleInputChange }
                    placeholder={ searchPlaceHolder }
                />

                <div></div>
            </div>

            {children}
        </div>
    );
}

export default PageContainer;