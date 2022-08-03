import React, {useState} from 'react';''
import { 
    Accordion, AccordionSummary, AccordionDetails, Button, Slider, TextField, Typography,
} from '@mui/material/';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import { ConstructionOutlined } from '@mui/icons-material';

/**
 * Search up new stops for your route
 */
type SearchStopProps = {
    onSearchStop : (stopType : string, percentThrough : number) => void;
    disabled : boolean;
}

export default function SearchStop({onSearchStop, disabled}: SearchStopProps) {
    const [progress, setProgress] = useState(50);
    const [stopType, setStopType] = useState("food");

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
                    onChangeCapture={(event) => {
                        setStopType((event.target as HTMLInputElement).value)
                    }}
                />
                <Typography id="input-slider" gutterBottom>
                    Percent of way between start and end
                </Typography>
                <Slider
                  aria-label="percent of way through trip"
                  defaultValue={50}
                  getAriaValueText={valuetext}
                  valueLabelDisplay="on"
                  onChangeCommitted={(e, val) => {
                      setProgress(val as number)
                  }}
                  step={1}
                  min={0}
                  max={100}
                />
                <Button variant="contained" 
                    onClick={() => onSearchStop(stopType, progress)}
                >Search</Button>
            </Typography>
            </AccordionDetails>
      </Accordion>
    )
}