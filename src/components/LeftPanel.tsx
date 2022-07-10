import React, { useState } from 'react';
import { Button } from '@mui/material';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import ThreeDRotation from '@mui/icons-material/ThreeDRotation';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import Results from './Results';
import SearchAndRoute from './SearchAndRoute';
import DetailedResult from './DetailedResult';


/**
 * Left panel of the display.
 * Page 0: search and address bars
 * Page 1: Search results
 * Page 2: Detailed result, if something is selected
 */

type LeftPanelProps = {
    onAdd: (index: number) => void;
    stops: {}[];
    searchResults: {}[];
    onSearch: (query: string, label: string) => void;
    onSearchStop: (stopType: string, percentThrough: number) => void;
    routeResponse: { [key: string]: any } | undefined;
}

export default function LeftPanel({ onAdd, searchResults, stops, onSearch, onSearchStop, routeResponse }: LeftPanelProps) {
    const [page, setPage] = useState(0);
    const [selectedResult, setSelectedResult] = useState(1);

    const goLeft = () => {
        setPage(page - 1);
    }
    const goRight = () => {
        setPage(page + 1);
    }
    const onResultSelect = (index: number) => {
        setSelectedResult(index);
    }

    const getPage = () => {
        if (page == 0) {
            return (
                <div>
                    <SearchAndRoute stops={stops} onSearch={onSearch} onSearchStop={onSearchStop} routeResponse={routeResponse} />
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
                <div>
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
                <div>
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