import { strict as assert } from 'assert';
import { Box } from '@mui/material';
import React, {useState} from 'react';''
import LeftPanel from './LeftPanel';
import MapDisplay from './MapDisplay';
import { getEncodedAddress } from '../lib/addressSearch';
import { getRouteForDisplay } from '../lib/mapDisplay';

/**
 * The full display, including search/results/detailed results on the LeftPanel, and map widget on the right
 */
export default function Display() {
    const [hasStart, setHasStart] = useState(false);
    const [hasEnd, setHasEnd] = useState(false);

    const initialStops : {}[] = [];
    const [stops, setStops] = useState(initialStops);

    const [routeResponse, setRouteResponse] = useState<{[key : string] : any} | undefined>(undefined);

    const [searchResults, setSearchResults] = useState([{"foo": "bar"}, {"foo": "go"}, {"foo": 2}])
    
    /**
     * Address and stop search functions. Results are passed into every child component
     */
    const onAddStop = (index: number) => {
        // Update list of stops when a stop is added
        // Asserts should never fail; we shouldn't let people add stops without a start and stop
        const selectedResult = searchResults[index];
        assert.notEqual(stops.length, 0);
        assert.notEqual(stops.length, 1);

        const allButDest = stops.slice(0,-1).concat([selectedResult]);
        setStops(allButDest.concat(stops[-1]));
    }

    const onSearchStop = (stopType : string, percentThrough : number) => {
        // Conduct a stop search and update all the search results
        setSearchResults([{"foo": "bar"}, {"foo": "go"}, {"foo": 3}])
    }

    const onSearch = async (addressQuery : string, addressLabel : string) => {
        const response = await getEncodedAddress(addressQuery);
        var newStops : {}[];

        if (addressLabel == 'Start') {  
            const stopData = response.features[0];
            if (hasStart) { // override the old start
                // TODO: ask the user whether they want to wipe all of their
                // non-destination stops if they exist
                if (addressQuery.length == 0) {
                    // we no longer have a start
                    newStops = stops.slice(1)
                    setHasStart(false);
                } else {
                    newStops = [stopData].concat(stops.slice(1))
                }
            } else {
                newStops = [stopData].concat(stops)
                setHasStart(true);
            }
            setStops(newStops);
        } else { // Addresslabel is end
            const stopData = response.features[0];
            if (hasEnd) { // override the old end
                // TODO: ask the user whether they want to wipe all of their
                // non-destination stops if they exist
                if (addressQuery.length == 0) {
                    // we no longer have an end
                    newStops = stops.slice(0, -1)
                    setHasEnd(false);
                } else {
                    newStops = stops.slice(0,-1).concat([stopData])
                }
            } else {
                newStops = stops.concat([stopData])
                setHasEnd(true);
            }
            setStops(newStops);
        }
        if (newStops.length >= 2) {
            const routeData = await getRouteForDisplay(newStops)
            setRouteResponse(routeData.routes[0])
        }
    }

    return (
        <Box
            sx={{
            display: 'flex',
            p: 4,
            border: "1px solid gray",
            width: '100%'
            }}
        >
            <LeftPanel 
                onAdd={onAddStop}
                searchResults={searchResults}
                stops={stops}
                onSearch={onSearch}
                onSearchStop={onSearchStop}
                routeResponse={routeResponse}
            />
            <MapDisplay stops={stops} routeResponse={routeResponse} />
        </Box>
    )
}