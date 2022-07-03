import React, {useState} from 'react';''
import Button from '@mui/material/Button';

/**
 * The stop add button
 */
type AddButtonProps = {
    onClick: () => void;
}

export default function AddButton({onClick}: AddButtonProps) {
    const [isAdd, setIsAdd] = useState(true);

    return (
        <Button variant="contained" 
            onClick={onClick}
            sx={{ flex: 1}}
        >
            {isAdd ? "Add" : "Remove"}
        </Button>
    )
}