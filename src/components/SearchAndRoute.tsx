import React, {useState} from 'react';''
import { Stack } from '@mui/material';
import AddressBar from './AddressBar';
import SearchStop from './SearchStop';
import Directions from './Directions';

/** 
 * Address bars for start, end, and stops; contains section for searching for more stops
*/
type SearchAndRouteProps = {
    stops: {}[];
    onSearch: (query : string, label : string) => void;
    onSearchStop: (stopType : string, percentThrough : number) => void;
    routeResponse: {[key : string] : any} | undefined
}

export default function SearchAndRoute({stops, onSearch, onSearchStop, routeResponse}: SearchAndRouteProps) {

    return (
        <Stack spacing={2}>
            <AddressBar addressLabel='Start' onSearch={onSearch} />
            <AddressBar addressLabel='End' onSearch={onSearch} />
            <SearchStop onSearchStop={onSearchStop} disabled={stops.length < 2} />
            <Directions routeResponse={routeResponse} />
        </Stack>
    )
}