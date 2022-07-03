import { Box } from '@mui/material';
import React, {useState} from 'react';
import Button from '@mui/material/Button';

/**
 * Page displaying detailed information about a selected result, in the left panel (page 2)
 */
type DetailedResultProps = {
    data: {
        [key: string]: any
    };
    index: number;
}

export default function DetailedResult({data, index}: DetailedResultProps) {
    const [placeName, setPlaceName] = useState(data["foo"]);

    return (
        <div>
            {placeName}: {index}
            <Button variant="contained">Heg</Button>
        </div>
    )
}