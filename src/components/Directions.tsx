import React, {useState} from 'react';
import { convertToObject } from 'typescript';
import '../index.css'

/** 
 * Address bars for start, end, and stops; contains section for searching for more stops
*/
type DirectionsProps = {
    routeResponse: {[key : string] : any} | undefined;
}

export default function Directions({routeResponse} : DirectionsProps) {
    const extractDirections = () => {
        if (routeResponse) {
            const steps = routeResponse.legs[0].steps;
            console.log(steps)

            return (
                <div id="direction-text">
                    {steps.map((step:any) => (<li>{step.maneuver.instruction}</li>))}
                </div>
            )
        } else {
            return <div></div>
        }
    }

    return (
        <div className="directions-container">
            <div className="directions">
                {extractDirections()}
            </div>
        </div>
    )
}