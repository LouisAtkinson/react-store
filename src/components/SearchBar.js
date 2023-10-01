import React from 'react';

export default function SearchBar(props) {
    function handleSearch(e) {
        e.preventDefault();
        props.setSearchInput(e.target.value);
    }

    function applySearch() {
        props.applyFilters();
        props.handleFilterChange('search', props.searchInput)
    }

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search"
                value={props.searchInput}
                onChange={handleSearch}
            />
            <button onClick={applySearch}>Search</button>
        </div>
    );
}
