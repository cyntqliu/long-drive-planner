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
            const legs : {[key : string] : any}[] = routeResponse.legs // list of dicts with "steps"
            var allSteps : {}[] = [];
            for (const leg of legs) {
                allSteps = allSteps.concat(leg.steps)
            }

            return (
                <div id="direction-text" className="directions">
                    {allSteps.map((step:any) => (<li>{step.maneuver.instruction}</li>))}
                </div>
            )
        } else {
            return <div></div>
        }
    }

    return (
        <div className="directions-container">
            {extractDirections()}
        </div>
    )
}