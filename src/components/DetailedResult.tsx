import { Box } from '@mui/material';
import React, {useState} from 'react';
import Button from '@mui/material/Button';
import { FULL_NAME_KEY, PLACE_NAME_KEY } from '../lib/constants'

/**
 * Page displaying detailed information about a selected result, in the left panel (page 2)
 */
type DetailedResultProps = {
    data: ({ [key: string]: any }) | undefined;
    index: number;
    onAdd: (index: number, percent: number) => void;
}

export default function DetailedResult({data, index, onAdd}: DetailedResultProps) {
    var initialPlaceName = "foo"
    var initialAddress = "bar"
    var initialPercent = 0

    if (data) {
        initialPlaceName = data[PLACE_NAME_KEY]
        initialAddress = data[FULL_NAME_KEY]
        initialPercent = data["percent"]
    }
    const [placeName, setPlaceName] = useState(initialPlaceName);
    const [address, setAddress] = useState(initialAddress)

    return (
        <div className="left-panel-contents">
            {placeName}: {address}
            <Button variant="contained" onClick={() => onAdd(index, initialPercent)}>Add</Button>
        </div>
    )
}