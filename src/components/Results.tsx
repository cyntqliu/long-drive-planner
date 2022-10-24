import React, {useState} from 'react';''
import SearchResult from './SearchResult';

/**
 * All search results (page 1 of left panel)
 */
type ResultsProps = {
    onAdd: (index: number, percent: number) => void;
    searchResults: {}[];
}

export default function Results({onAdd, searchResults}: ResultsProps) {

    return (
        <div className="left-panel scrolling-contents">
            {
                searchResults.map((result, i) => (
                    <SearchResult onAdd={onAdd} data={result} index={i} key={i} />
                ))
            }
        </div> // todo
    )
}