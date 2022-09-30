/**
 * Methods for interpreting, manipulating, and searching stop types
 */
 import { makeApiQueryURLJSON, overrideOptionalDefaults } from "./utils/apiCallUtils";

const GEOCODING_ENDPOINT = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
const DEFAULT_OPT_PARAMS = {
   "access_token": process.env.REACT_APP_API_KEY !== undefined ? process.env.REACT_APP_API_KEY : '',
   "type" : "poi",
}

function computeProgressThruRoute(
   progress : number, route : {[key : string] : any} | undefined
) {
   return [-73.990593, 40.740121];
}

function sortResultsByTimeAdded(results : {}[]) {
   return results;
}

/**
 * get stops of type stopType, progress percent of the way through route
 * 
 * @param stopType - string indicating type of stop desired (e.g. food, gas)
 * @param progress - percent of way through route 
 * @param route - route details
 * @returns response from the places API
 */
async function getStops(
   stopType : string, progress : number, route : {[key : string] : any} | undefined
) {
   const coordinates = computeProgressThruRoute(progress, route);
   const settings = { 
      "proximity" : coordinates[0].toString().concat(",", coordinates[1].toString())
   }
   const opt_params = overrideOptionalDefaults(DEFAULT_OPT_PARAMS, settings)
   const query = makeApiQueryURLJSON(
      GEOCODING_ENDPOINT, [stopType], opt_params
   )
   console.log(query);
   
   const fetchPOIStops = async () : Promise<{[key : string] : any}> => {
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

   const response = await fetchPOIStops();
   return response;
}

export { sortResultsByTimeAdded, getStops }