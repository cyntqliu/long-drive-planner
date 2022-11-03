import { Box, Button, Stack } from '@mui/material';
import React, {useState} from 'react';
import AddButton from './AddButton';
import '../index.css'
import { FULL_NAME_KEY, PLACE_NAME_KEY } from '../lib/constants'
/**
 * A single search result in Results
 */
type SearchResultProps = {
    onAdd: (index: number, percent: number) => void;
    data: {
        [key: string]: any
    };
    index: number;
    onResultSelect: (index: number) => void;
}

export default function SearchResult({onAdd, data, index, onResultSelect}: SearchResultProps) {
    const [placeName, setPlaceName] = useState(data[PLACE_NAME_KEY]);
    const [fullName, setFullName] = useState(data[FULL_NAME_KEY])

    return (
        <Box
            sx={{
            display: 'flex',
            p: 2, // padding
            border: "1px solid gray"
            }}
            className="left-panel-contents"
        >
            <div style={{ flex: 5}}>
                <Stack
                    spacing={1}
                    alignItems="flex-start"
                    justifyContent="space-evenly"
                >
                    <Button onClick={() => onResultSelect(index)}>{placeName}</Button>
                    <div>{fullName}</div>
                </Stack>
            </div>
            <AddButton onClick={() => onAdd(index, data["percent"])}/>
        </Box>
    )
}