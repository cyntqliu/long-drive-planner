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
const DIRECTIONS_ENDPOINT = "https://api.mapbox.com/directions/v5/mapbox/";
const DIRECTIONS_OPT_PARAMS = {
    "access_token": process.env.REACT_APP_API_KEY !== undefined ? process.env.REACT_APP_API_KEY : '',
}

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
        res.json(response)
    } catch (error) {
        next(error);
    }
})

// get route
app.get("/route/:profile/:coordinates", async (req, res, next) => {
    try {
        const profile = req.params.profile;
        const coordinates = req.params.coordinates
        const settings = {
            "geometries" : (req.query.geometries as string), 
            "steps" : (req.query.steps as string),
            "overview" : (req.query.overview as string),
            "annotations": (req.query.annotations as string),
        }
        const opt_params = overrideOptionalDefaults(DIRECTIONS_OPT_PARAMS, settings)
        const query = makeApiQueryURLJSON(
            DIRECTIONS_ENDPOINT, [profile, coordinates], opt_params, "/"
        )

        console.log(query)
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
        res.json(response)
    } catch (error) {
        next(error);
    }
})
  
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
  