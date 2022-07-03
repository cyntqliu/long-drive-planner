/**
 * Methods for interpreting and searching specific addresses, and returning said results
 */
import { makeApiQueryURLJSON, overrideOptionalDefaults } from "./utils/apiCallUtils";

const GEOCODING_ENDPOINT = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
const DEFAULT_OPT_PARAMS = {
    "access_token": process.env.REACT_APP_API_KEY !== undefined ? process.env.REACT_APP_API_KEY : '',
}

function suggestAddresses(query : string) {
    // given an unsubmitted search query, return a list of
    // address suggestions
    return null;
}

async function getEncodedAddress(searchAddress : string, optParams : { [key: string] : any} = {}) {
    // given an address, return the forward geoencoding of said address
    const query = makeApiQueryURLJSON(
        GEOCODING_ENDPOINT, [searchAddress], DEFAULT_OPT_PARAMS,
    )
    const fetchCoordinates = async (): Promise<{[key: string] : any}> => {
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
    const response = await fetchCoordinates();
    return response;
}

export {suggestAddresses, getEncodedAddress}
