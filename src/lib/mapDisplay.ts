/**
 * Methods for displaying and handling the map, including helper methods
 */
 import { makeApiQueryURLJSON, overrideOptionalDefaults } from "./utils/apiCallUtils";

 const DIRECTIONS_ENDPOINT = "https://api.mapbox.com/directions/v5/mapbox/";
 const DEFAULT_OPT_PARAMS = {
    "access_token": process.env.REACT_APP_API_KEY !== undefined ? process.env.REACT_APP_API_KEY : '',
}

/**
 * 
 * @param stops - ordered list of jsons of stop data from places api
 * @param traffic - boolean indicating if we want to consider traffic in route
 * @returns response from the directions api
 */
async function getRouteForDisplay(stops : Array<{ [key : string] : any}>, traffic : boolean = false) {
    // given the stops, extract the necessary information and make an api
    // request to get the route
    
    let profile : string;
    if (traffic) {
        profile = "driving-traffic";
    } else {
        profile = "driving";
    }

    let coordinates : string = "";
    for (const stop of stops) {
        coordinates += (stop["center"][0].toString() + "," + stop["center"][1].toString() + ";")
    }
    coordinates = coordinates.substring(0, coordinates.length-1);
    const settings = { "geometries" : "geojson", "steps" : "true" }
    const opt_params = overrideOptionalDefaults(DEFAULT_OPT_PARAMS, settings)

    const query = makeApiQueryURLJSON(
        DIRECTIONS_ENDPOINT, [profile, coordinates], opt_params, "/"
    )
    const fetchRoute = async (): Promise<{[key: string] : any}> => {
        try {
            const response = await fetch(query)
            const data = await response.json()
            return data;
        } catch (error: any) {
            return {
                "message": error.message,
            }
        }
    }
    const response = await fetchRoute();
    return response;
}

/**
 * Convert stops from the places API to a GeoJSON for map display
 * @param stops - ordered list of jsons of stop data from places api
 * @returns a geojson-converted version of the stops
 */
function convertStopsToMarker(stops : Array<{ [key : string] : any}>) {
    // Need to convert the stops to geojson
    var geojson : {[key : string] : any} = { "type" : 'FeatureCollection'};
    var features : {}[] = [];
    for (const stop of stops) {
        const geoStop = {
            "type" : stop["type"],
            "geometry" : {
                "type" : "Point",
                "coordinates" : stop["center"],
            },
            "properties" : {
                "name": stop["place_name"]
            }
        }
        features.push(geoStop);
    }
    geojson.features = features
    return geojson;
}

export {getRouteForDisplay, convertStopsToMarker};