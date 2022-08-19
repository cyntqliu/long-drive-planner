/**
 * Module of all miscellaneous utility functions that do not
 * center around API calls
 */

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

export {sortedIndex};
