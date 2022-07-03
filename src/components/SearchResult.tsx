import { Box } from '@mui/material';
import React, {useState} from 'react';
import AddButton from './AddButton';

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

export default function SearchResult({onAdd, data, index}: SearchResultProps) {
    const [placeName, setPlaceName] = useState(data["foo"]);

    return (
        <Box
            sx={{
            display: 'flex',
            p: 4,
            border: "1px solid gray"
            }}
        >
            <div style={{ flex: 3}}>
                {placeName}
            </div>
            <AddButton onClick={() => onAdd(index)}/>
        </Box>
    )
}