import express from "express";
import path from "path";
import fetch from "node-fetch";
import * as dotenv from 'dotenv'
dotenv.config()
import { makeApiQueryURLJSON, overrideOptionalDefaults } from "../src/lib/utils/apiCallUtils";

const app = express()
const PORT = 8080;

const PLACES_ENDPOINT = "https://api.mapbox.com/geocoding/v5/mapbox.places/"
const PLACES_OPT_PARAMS = {
    "access_token": process.env.REACT_APP_API_KEY !== undefined ? process.env.REACT_APP_API_KEY : '',
    "type" : "poi",
}

app.get("/foo/:place", (req, res) => {
    console.log(req.params.place)
    res.send({"test":"a"});
});

// load the compiled react files, which will serve /index.html
const reactPath = path.resolve(__dirname, "..", "build");
app.use(express.static(reactPath));

// for all other routes, render index.html and let react router handle it
app.get("/", (req, res) => {
    res.sendFile(path.join(reactPath, "index.html"));
});

// get endpoint address (start or end)

// search stops
app.get("/stops/:stoptype", async (req, res, next) => {
    try {
        const stopType = req.params.stoptype
        const settings = {
            "proximity": (req.query.proximity as string),
        }
        const opt_params = overrideOptionalDefaults(PLACES_OPT_PARAMS, settings)
        const query = makeApiQueryURLJSON(
            PLACES_ENDPOINT, [stopType], opt_params
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
        console.log(response)
        res.json(response)
    } catch (error) {
        next(error);
    }
})
    
  
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
  