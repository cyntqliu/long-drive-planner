/**
 * Module of all miscellaneous utility functions that do not
 * center around API calls
 */
import { FULL_NAME_KEY } from './constants';

// taken directly from https://stackoverflow.com/questions/1344500/efficient-way-to-insert-a-number-into-a-sorted-array-of-numbers
function sortedIndex(array: number[], value: number) {
    var low: number = 0;
    var high = array.length;

    while (low < high) {
        var mid = (low + high) >>> 1;
        if (array[mid] < value) low = mid + 1;
        else high = mid; 
    }
    return low;
}


function buildGMapsURL(stops: { [key: string] : any }[]) {
    var baseURL : string = "https://www.google.com/maps/dir/";
    const whiteSpace = /\s/g;
    for (const stop of stops) {
        // format the address of the stop correctly for the url
        const address = stop[FULL_NAME_KEY];
        const urlAddress = address.replaceAll(whiteSpace, "+");
        baseURL = baseURL.concat(urlAddress).concat("/");
    }

    return baseURL;
}

export {buildGMapsURL, sortedIndex};
