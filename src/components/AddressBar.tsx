import React, {useState} from 'react';''
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

/**
 * Bars in which to display addresses of stops in the route
 */
type AddressBarProps = {
    addressLabel : string;
    onSearch : (query : string, label : string) => void;
}

export default function AddressBar({addressLabel, onSearch}: AddressBarProps) {
    const [address, setAddress] = useState('');
    const handleSubmit = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            onSearch((event.target as HTMLTextAreaElement).value, addressLabel);
        }
        setAddress((event.target as HTMLTextAreaElement).value);
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={2}>
                {addressLabel}
            </Grid>
            <Grid item xs={10}>
                <TextField
                    onKeyUpCapture={handleSubmit}
                    id={addressLabel}
                    variant="outlined"
                />
            </Grid>
        </Grid>
    )
}