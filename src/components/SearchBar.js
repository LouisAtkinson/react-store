import React from 'react';

export default function SearchBar(props) {
    function handleSearch(e) {
        e.preventDefault();
        props.setSearchInput(e.target.value);
    }

    return (
        <input
            type="text"
            placeholder="Search"
            value={props.searchInput}
            onChange={handleSearch}
        />
    )
}