import { Box, Stack } from '@mui/material';
import React, {useState} from 'react';
import AddButton from './AddButton';
import '../index.css'

/**
 * A single search result in Results
 */
type SearchResultProps = {
    onAdd: (index: number) => void;
    data: {
        [key: string]: any
    };
    index: number;
}


const PLACE_NAME_KEY : string = "text";
const FULL_NAME_KEY : string = "place_name";

export default function SearchResult({onAdd, data, index}: SearchResultProps) {
    const [placeName, setPlaceName] = useState(data["text"]);
    const [fullName, setFullName] = useState(data["place_name"])

    return (
        <Box
            sx={{
            display: 'flex',
            p: 4,
            border: "1px solid gray"
            }}
            className="fittedBox"
        >
            <div style={{ flex: 3}}>
                <Stack 
                    spacing={1}
                    alignItems="flex-start"
                    justifyContent="space-evenly"
                >
                    <div>{placeName}</div>
                    <div>{fullName}</div>
                </Stack>
            </div>
            <AddButton onClick={() => onAdd(index)}/>
        </Box>
    )
}