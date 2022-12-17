/**
 * Methods for interpreting, manipulating, and searching stop types
 */
import { makeApiQueryURLJSON } from "./utils/apiCallUtils";

const GEOCODING_ENDPOINT = "/stops/";

function computeProgressThruRoute(
   progress : number, route : {[key : string] : any} | undefined
) {
   if (route) {
      var totalDuration = 0;
      for (const leg of route.legs) {
         totalDuration += leg.duration;
      }
      const progressDuration = totalDuration * (progress / 100)
      console.log("Progress into trip (min):")
      console.log(progressDuration/60)

      // For simplicity, assume that speed on any stretch of a
      // step (driving instruction with no turns) is constant
      var accumulatedDuration = 0;
      for (const leg of route.legs) {
         if ((accumulatedDuration + leg.duration) < progressDuration) {
            accumulatedDuration += leg.duration
         } else {
            var start = leg.steps[0].maneuver.location
            for (const step of leg.steps.slice(1,)) {
               if ((accumulatedDuration + step.duration) >= progressDuration) {
                  const end = step.maneuver.location
                  const frac = (progressDuration - accumulatedDuration) / (step.duration)
                  const searchLat = start[1] + frac * (end[1] - start[1])
                  const searchLng = start[0] + frac * (end[0] - start[0])
                  return [searchLng, searchLat]
               } else {
                  accumulatedDuration += step.duration
                  start = step.maneuver.location
               }
            }
            // we should never end up here logically
            console.log("IMPOSSIBLE LOCATION 1 REACHED")
            console.log("progressDuration || accumulatedDuration")
            console.log(progressDuration)
            console.log(accumulatedDuration)
            return start
         }
      }
      // search at the destination, likewise should never end up 
      // here
      console.log("IMPOSSIBLE LOCATION 2 REACHED")
      console.log("progressDuration || accumulatedDuration")
      console.log(progressDuration)
      console.log(accumulatedDuration)
      return route.waypoints.at(-1).location
   } else {
      return [-73.990593, 40.740121];
   }
}

function sortResultsByTimeAdded(results : {[key: string]: any}[]) {
   // TODO
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
   const query = makeApiQueryURLJSON(
      GEOCODING_ENDPOINT, [stopType], settings
   )
   
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