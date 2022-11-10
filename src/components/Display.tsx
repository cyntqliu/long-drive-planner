import { strict as assert } from 'assert';
import { Box } from '@mui/material';
import React, {useState} from 'react';''
import LeftPanel from './LeftPanel';
import MapDisplay from './MapDisplay';
import { getEncodedAddress } from '../lib/addressSearch';
import { getRouteForDisplay } from '../lib/mapDisplay';
import { getStops, sortResultsByTimeAdded } from '../lib/stopsSearch';
import { sortedIndex } from '../lib/utils/localUtils';

/**
 * The full display, including search/results/detailed results on the LeftPanel, and map widget on the right
 */
export default function Display() {
    const [hasStart, setHasStart] = useState(false);
    const [hasEnd, setHasEnd] = useState(false);
    const [startQuery, setStartQuery] = useState("");
    const [endQuery, setEndQuery] = useState("");
    const [leftPanelPage, setLeftPanelPage] = useState(0);

    const initialStops : {}[] = [];
    const [stops, setStops] = useState(initialStops);

    const initialStopPercents : number[] = [];
    const [stopPercents, setStopPercents] = useState(initialStopPercents)

    const [routeResponse, setRouteResponse] = useState<{[key : string] : any} | undefined>(undefined);

    const initSearchResults : {}[] = [];
    const [searchResults, setSearchResults] = useState(initSearchResults)

    const [selectedResult, setSelectedResult] = useState(-1);

    /**
     * Populate the details page with detailed information about
     * the selected search result, and automatically go to that page
     * 
     * @param index index of selected search result
     */
    const onResultSelect = (index: number) => {
        setSelectedResult(index)
        setLeftPanelPage(2) // automatically go to the detailed result
    }
    
    /**
     * Add a searched stop to stops
     * 
     * @param index - index of the selected stop from the searched results
     * @param percent - percent of the way through trip selected stop is
     */
    const onAddStop = async (index: number, percent: number) => {
        // Update list of stops when a stop is added
        // Asserts should never fail; we shouldn't let people add stops without a start and stop
        const selectedResult = searchResults[index];
        assert.notEqual(stops.length, 0);
        assert.notEqual(stops.length, 1);

        const insertIndex = sortedIndex(stopPercents, percent) + 1
        const newStopPercents = stopPercents.slice(0, insertIndex).concat(percent);
        setStopPercents(newStopPercents.concat(stopPercents.slice(insertIndex)));

        const allButDest = stops.slice(0,insertIndex).concat([selectedResult]);
        const newStops = allButDest.concat(stops.slice(insertIndex));
        setStops(newStops);

        const routeData = await getRouteForDisplay(newStops)
        setRouteResponse(routeData.routes[0])
        setSearchResults(initSearchResults) // clear the search results
        setLeftPanelPage(0) // automatically turn back to directions and route
        setSelectedResult(-1) // reset the detailed result so we cannot access it
    }

    /**
     * Remove a searched stop from stops
     */
    const onRemoveStop = async (index: number) => {
        // Update list of stops when a stop is removed
        const selectedResult = searchResults[index + 1];
        console.log("heg") // TODO next time
    }

    /**
     * Stop search function. Sets search results to query results
     * 
     * @param stopType - type of stop requested (e.g. food, hotel)
     * @param percentThrough - percent of way through trip (integer percent)
     */
    const onSearchStop = async (stopType : string, percentThrough : number) => {
        // Conduct a stop search and update all the search results
        const response = await getStops(stopType, percentThrough, routeResponse);
        // manually set the percent
        response["percent"] = percentThrough;
        const bestStops = sortResultsByTimeAdded(response.features)
        setSearchResults(bestStops)
        setLeftPanelPage(1) // automatically switch to the search results
    }

    /**
     * Address search function. Modifies stops to reflect new start or end
     * 
     * @param addressQuery - text input of the address search box
     * @param addressLabel - label of the address search box (either 'Start'
     *      or 'End')
     */
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
                    setSearchResults(initSearchResults);
                } else {
                    newStops = [stopData].concat(stops.slice(1))
                }
            } else {
                newStops = [stopData].concat(stops)
                setHasStart(true);
            }
            setStops(newStops);
            // remember to maintain the contents of the textbox
            setStartQuery(addressQuery);
        } else { // Addresslabel is end
            const stopData = response.features[0];
            if (hasEnd) { // override the old end
                // TODO: ask the user whether they want to wipe all of their
                // non-destination stops if they exist
                if (addressQuery.length == 0) {
                    // we no longer have an end
                    newStops = stops.slice(0, -1)
                    setHasEnd(false);
                    setSearchResults(initSearchResults);
                } else {
                    newStops = stops.slice(0,-1).concat([stopData])
                }
            } else {
                newStops = stops.concat([stopData])
                setHasEnd(true);
            }
            setStops(newStops);
            // remember to maintain the contents of the textbox
            setEndQuery(addressQuery);
        }
        if (newStops.length >= 2) {
            const routeData = await getRouteForDisplay(newStops)
            setRouteResponse(routeData.routes[0])
        }
    }

    /**
     * Functions for handling page turning for left panel
     */
    const goLeft = () => {
        setLeftPanelPage(leftPanelPage - 1);
    }
    const goRight = () => {
        setLeftPanelPage(leftPanelPage + 1);
    }

    /**
     * Return the actual component
     */
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
                onSearch={onSearch}
                onAdd={onAddStop}
                startQuery={startQuery}
                endQuery={endQuery}
                searchResults={searchResults}
                stops={stops}
                onSearchStop={onSearchStop}
                onRemoveStop={onRemoveStop}
                routeResponse={routeResponse}
                onResultSelect={onResultSelect}
                page={leftPanelPage}
                goLeft={goLeft}
                goRight={goRight}
                selectedResult={selectedResult}
            />
            <MapDisplay 
                stops={stops}
                routeResponse={routeResponse}
                searchResults={searchResults}
            />
        </Box>
    )
}