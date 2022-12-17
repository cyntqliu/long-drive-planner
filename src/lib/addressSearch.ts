/**
 * Methods for interpreting and searching specific addresses, and returning said results
 */
import { makeApiQueryURLJSON, overrideOptionalDefaults } from "./utils/apiCallUtils";

const GEOCODING_ENDPOINT = "/address/";

function suggestAddresses(query : string) {
    // given an unsubmitted search query, return a list of
    // address suggestions
    return null;
}

async function getEncodedAddress(searchAddress : string, optParams : { [key: string] : any} = {}) {
    // given an address, return the forward geoencoding of said address
    const query = makeApiQueryURLJSON(
        GEOCODING_ENDPOINT, [searchAddress], {},
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
