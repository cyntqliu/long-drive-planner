import { Box, IconButton } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import React, {useState} from 'react';
import { PLACE_NAME_KEY } from '../lib/utils/constants'

/**
 * Page displaying detailed information about a selected result, in the left panel (page 2)
 */
type StopOnRouteProps = {
    data: ({ [key: string]: any })
    index: number;
    onRemove: (index: number) => void;
}

export default function StopOnRoute({data, index, onRemove}: StopOnRouteProps) {
    const [placeName, setPlaceName] = useState(data[PLACE_NAME_KEY]);

    return (
        <Box
            sx={{
            display: 'flex',
            p: 1, // padding
            border: "1px dashed",
            borderColor: '#bbbbbb',
            borderRadius : 3,
            margin: 1,
            }}
            className="stop-on-page-zero"
        >
            <div style={{ flex: 4}}>{placeName}</div>
            <div style={{ flex: 1}}>{data["percent"]}%</div>
            <IconButton
                aria-label="remove stop"
                onClick={() => onRemove(index)}
            >
                <CancelIcon />
            </IconButton>
        </Box>
    )
}