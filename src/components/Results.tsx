import React, {useState} from 'react';''
import SearchResult from './SearchResult';

/**
 * All search results (page 1 of left panel)
 */
type ResultsProps = {
    onAdd: (index: number) => void;
    searchResults: {}[];
}

export default function Results({onAdd, searchResults}: ResultsProps) {

    return (
        <div>
            {
                searchResults.map((result, i) => (
                    <SearchResult onAdd={onAdd} data={result} index={i} key={i} />
                ))
            }
        </div> // todo
    )
}