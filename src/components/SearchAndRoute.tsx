import React, {useState} from 'react';''
import { Stack } from '@mui/material';
import AddressBar from './AddressBar';
import SearchStop from './SearchStop';

/** 
 * Address bars for start, end, and stops; contains section for searching for more stops
*/
type SearchAndRouteProps = {
    stops: {}[];
    onSearch: (query : string, label : string) => number;
    onSearchStop: (stopType : string, percentThrough : number) => void;
}

export default function SearchAndRoute({stops, onSearch, onSearchStop}: SearchAndRouteProps) {

    return (
        <Stack spacing={2}>
            <AddressBar addressLabel='Start' onSearch={onSearch} />
            <AddressBar addressLabel='End' onSearch={onSearch} />
            <SearchStop onSearch={onSearchStop} disabled={stops.length < 2} />
        </Stack>
    )
}