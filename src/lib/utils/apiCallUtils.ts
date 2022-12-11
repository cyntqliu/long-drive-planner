function removejson(query : string) {
    // optionally remove .json from the ending of an element
    const length = query.length
    if (length <= 5) {
        return query
    }
    if (query.substring(length-5) == ".json") {
        return query.substring(0, length-5)
    }
    return query
}

function makeApiQueryURLJSON(
    endpoint : string, reqParams : string[], optParams : {[key: string] : string}, reqSeparator? : string
) {
    /**
     * given an endpoint, required parameters, and optional parameters
     * return the full api query used
     * 
     * endpoint: str, url with endpoint
     * reqParams: list, required param values in order. Resulting
     *            string must have `.json` at the end of the required params
     * optParams: dict, any optional params with their values
     * reqSeparator: optional str, character that separates required parameters 
     *            (may differ depending on endpoint)
     * 
     * returns: the fully formatted api query
     **/ 
    var url = endpoint;
    if (url[url.length - 1] != "/") {
        url += "/";
    }

    const urlSafeReqParams : string[] = [];
    reqParams.forEach(
        (element) => {
            const jsonless_element = removejson(element)
            urlSafeReqParams.push(encodeURIComponent(jsonless_element))
        }
    )

    let reqParamsStr;
    if (reqSeparator) {
        reqParamsStr = urlSafeReqParams.join(reqSeparator) + ".json";
    } else {
        reqParamsStr = urlSafeReqParams.join() + ".json";
    }
    url += reqParamsStr;

    if (Object.keys(optParams).length > 0) {
        url += "?"
        for (const [key, value] of Object.entries(optParams)) {
            url += key + "=" + encodeURIComponent(value) + "&";
        }
        url = url.substring(0, url.length-1)
    }
    return url;
}

function overrideOptionalDefaults(
    defaults : {[key: string] : string}, settings : {[key: string] : string},
) {
    /**
     * Given a set of default options for optional params, as well as the
     * options the user manually set, override the corresponding params
     * in defaults
     * 
     * defaults: dict, maps optional params to any default value they may have
     * settings: dict, maps optional params to value set by user if any
     * 
     * returns: the true set of optional parameters used
     */
    const realOptionalParams = JSON.parse(JSON.stringify(defaults));
    for (const [key, value] of Object.entries(settings)) {
        realOptionalParams[key] = value;
    }
    return realOptionalParams;
}

export {makeApiQueryURLJSON, overrideOptionalDefaults};