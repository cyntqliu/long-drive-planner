import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import ThreeDRotation from '@mui/icons-material/ThreeDRotation';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import '../index.css';

import Results from './Results';
import SearchAndRoute from './SearchAndRoute';
import DetailedResult from './DetailedResult';


/**
 * Left panel of the display.
 * curPage 0: search and address bars
 * curPage 1: Search results
 * curPage 2: Detailed result, if something is selected
 */

type LeftPanelProps = {
    onSearch: (query: string, label: string) => void; // handler for searching start or end
    onAdd: (index: number, percent: number) => void; // handler for adding addresses
    startQuery: string;
    endQuery: string;
    stops: {}[]; // current stops in route
    searchResults: {}[]; // current stop search results
    onSearchStop: (stopType: string, percentThrough: number) => void; // handler for searching stops
    routeResponse: { [key: string]: any } | undefined; // json containing route
    page: number; // page of LeftPanel
    goLeft: () => void; // handler for turning LeftPanel left
    goRight: () => void; // handler for turning LeftPanel right

}

export default function LeftPanel({ 
    onSearch, onAdd, startQuery, endQuery, searchResults, stops, 
    onSearchStop, routeResponse, page, goLeft, goRight
}: LeftPanelProps) {
    const [selectedResult, setSelectedResult] = useState(1);
    const onResultSelect = (index: number) => {
        setSelectedResult(index);
    }

    const getPage = () => {
        if (page == 0) {
            return (
                <div className="left-panel">
                    <SearchAndRoute 
                        stops={stops}
                        startQuery={startQuery}
                        endQuery={endQuery}
                        onSearch={onSearch}
                        onSearchStop={onSearchStop}
                        routeResponse={routeResponse}
                    />
                    <Button variant="outlined" endIcon={<KeyboardArrowRightIcon />}
                        onClick={() => {
                            goRight();
                        }}
                    >Search Results
                    </Button>
                </div>
            );
        } else if (page == 1) {
            return (
                <div className="left-panel">
                    <Results onAdd={onAdd} searchResults={searchResults} />
                    <Button variant="outlined" startIcon={<KeyboardArrowLeftIcon />}
                        onClick={() => {
                            goLeft();
                        }}
                    >Route and Search
                    </Button>
                    {selectedResult < 0 ? <div></div> :
                        <Button variant="outlined" endIcon={<KeyboardArrowRightIcon />}
                            onClick={() => {
                                goRight();
                            }}
                        >Detailed Result
                        </Button>
                    }
                </div>
            )
        } else {
            return (
                <div className="left-panel">
                    <DetailedResult data={searchResults[selectedResult]} index={selectedResult} />
                    <Button variant="outlined" startIcon={<KeyboardArrowLeftIcon />}
                        onClick={() => {
                            goLeft();
                        }}
                    >All search results
                    </Button>
                </div>
            )
        }
    }

    return (
        getPage()
    )
}