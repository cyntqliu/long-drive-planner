import React, {useState} from 'react';''
import { Stack } from '@mui/material';
import AddressBar from './AddressBar';
import SearchStop from './SearchStop';
import Directions from './Directions';
import '../index.css'

/** 
 * Address bars for start, end, and stops; contains section for searching for more stops
*/
type SearchAndRouteProps = {
    stops: {}[];
    startQuery: string;
    endQuery: string;
    onSearch: (query : string, label : string) => void;
    onSearchStop: (stopType : string, percentThrough : number) => void;
    routeResponse: {[key : string] : any} | undefined
}

export default function SearchAndRoute({
    stops, startQuery, endQuery, onSearch, onSearchStop, routeResponse
}: SearchAndRouteProps) {

    return (
        <Stack spacing={2} className="left-panel-contents">
            <AddressBar addressLabel='Start' addressContent={startQuery} onSearch={onSearch} />
            <AddressBar addressLabel='End' addressContent={endQuery} onSearch={onSearch} />
            <SearchStop onSearchStop={onSearchStop} disabled={stops.length < 2} />
            <Directions routeResponse={routeResponse} />
        </Stack>
    )
}