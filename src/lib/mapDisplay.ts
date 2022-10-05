/**
 * Methods for displaying and handling the map, including helper methods
 */
 import { makeApiQueryURLJSON, overrideOptionalDefaults } from "./utils/apiCallUtils";

 const DIRECTIONS_ENDPOINT = "https://api.mapbox.com/directions/v5/mapbox/";
 const DEFAULT_OPT_PARAMS = {
    "access_token": process.env.REACT_APP_API_KEY !== undefined ? process.env.REACT_APP_API_KEY : '',
}
const MAXZOOM = 17;
const AESTHETIC_ADJUSTMENT = 60;

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


/**
 * Determine the zoom level and center for map given route and
 * any stop search results
 * @param route - list of [long, lat] pairs representing the path
 * @param searchedStops - list of [long, lat] pairs representing any
 *  searchr results
 * @returns [float, float, float] - [zoom, longitude, latitude]
 */
function getMapZoomCenter(
    route : Array<Array<number>>, searchedStops : Array<Array<number>>
) {
    const allMarkers = route.concat(searchedStops)
    if (allMarkers.length == 0) {
        return [-1, 0, 0]
    }
    if (allMarkers.length == 1) {
        return [MAXZOOM, allMarkers[0][0], allMarkers[0][1]];
    } else { // allMarkers.length >= 2
        let maxNorth = allMarkers[0][1];
        let maxSouth = allMarkers[0][1];
        let maxEast = allMarkers[0][0];
        let maxWest = allMarkers[0][0];
        for (let i = 1; i < allMarkers.length; i++) {
            const coord = allMarkers[i]
            if (coord[0] > maxEast) {
                maxEast = coord[0]
            } else if (coord[0] < maxWest) {
                maxWest = coord[0]
            }

            if (coord[1] > maxNorth) {
                maxNorth = coord[1]
            } else if (coord[1] < maxSouth) {
                maxSouth = coord[1]
            }
        }
        const eastWest = Math.min(maxEast - maxWest, (180-maxEast) + (180+maxWest));
        const northSouth = maxNorth - maxSouth;
        const maxDistance = Math.max(eastWest, northSouth)
        console.log(maxDistance);

        if (maxDistance > 0) {
            const zoom = Math.min(MAXZOOM, Math.log2(
                (180 + AESTHETIC_ADJUSTMENT)/maxDistance)
            );
            const lngCenter = (maxEast + maxWest) / 2;
            const latCenter = (maxNorth + maxSouth) / 2;
            return [zoom, lngCenter, latCenter]
        } else {
            return [MAXZOOM, maxEast, maxNorth];
        }
    }
}


export {MAXZOOM, getRouteForDisplay, convertStopsToMarker, getMapZoomCenter};