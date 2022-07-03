import React, {useState} from 'react';''
import { 
    Accordion, AccordionSummary, AccordionDetails, Button, Slider, TextField, Typography,
} from '@mui/material/';

import AddCircleIcon from '@mui/icons-material/AddCircle';

/**
 * Search up new stops for your route
 */
type SearchStopProps = {
    onSearch : (stopType : string, percentThrough : number) => void;
    disabled : boolean;
}

export default function SearchStop({onSearch, disabled}: SearchStopProps) {

    function valuetext(value: number) {
        return `${value}%`;
    }

    return (
        <Accordion disabled={disabled}>
            <AccordionSummary
            expandIcon={<AddCircleIcon />}
            aria-controls="stotype-textbos percent-through"
            id="panel1a-header"
            >
            <Typography>Add stop...</Typography>
            </AccordionSummary>
            <AccordionDetails>
            <Typography>
                <TextField
                    id="stoptype-textbox"
                    label="Type of stop"
                    defaultValue="e.g. food, gas, hotel..."
                    variant="standard"
                />
                <Typography id="input-slider" gutterBottom>
                    Percent of way between start and end
                </Typography>
                <Slider
                  aria-label="percent of way through trip"
                  defaultValue={50}
                  getAriaValueText={valuetext}
                  valueLabelDisplay="on"
                  step={1}
                  min={0}
                  max={100}
                />
                <Button variant="contained" 
                    onClick={() => onSearch("food", 50)}
                >Search</Button>
            </Typography>
            </AccordionDetails>
      </Accordion>
    )
}