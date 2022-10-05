import React, {useState} from 'react';''
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

/**
 * Bars in which to display addresses of stops in the route
 */
type AddressBarProps = {
    addressLabel : string;
    addressContent : string;
    onSearch : (query : string, label : string) => void;
}

export default function AddressBar({addressLabel, addressContent, onSearch}: AddressBarProps) {
    const handleSubmit = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            onSearch((event.target as HTMLTextAreaElement).value, addressLabel);
        }
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={2} p={1}>
                {addressLabel}
            </Grid>
            <Grid item xs={10} p={1}>
                <TextField
                    onKeyUpCapture={handleSubmit}
                    id={addressLabel}
                    defaultValue={addressContent}
                    variant="outlined"
                />
            </Grid>
        </Grid>
    )
}