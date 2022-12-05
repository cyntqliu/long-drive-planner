import React, {useState, useEffect} from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
// import ReactMapGL from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import { convertStopsToMarker, getMapZoomCenter, MAXZOOM } from '../lib/mapDisplay';
import '../index.css';

mapboxgl.accessToken = process.env.REACT_APP_API_KEY !== undefined ? process.env.REACT_APP_API_KEY : '';
// @ts-ignore
// eslint-disable @typescript-eslint/no-var-requires
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

type MapDisplayProps = {
    stops: {}[];
    routeResponse: {[key : string] : any} | undefined;
    searchResults: {}[];
}

const ROUTE_ID = "route";
const stopMarkerColor = "#F09F63";

// TODO: REFACTOR OUT THE REPEATED LNG LAT SETTING INTO FN

/**
 * Right panel in the display, shows the map widget, route, and all search results
 */
export default function MapDisplay({stops, routeResponse, searchResults} : MapDisplayProps) {
    const mapContainer = React.useRef(null);
    const map = React.useRef<null|mapboxgl.Map>(null);
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);
    
    // actual route markers
    const initialRouteMarkers : mapboxgl.Marker[] = [];
    const [routeMarkers, setRouteMarkers] = useState(initialRouteMarkers);

    // stop markers
    const initialStopMarkers : mapboxgl.Marker[] = [];
    const [stopMarkers, setStopMarkers] = useState(initialStopMarkers);

    // cached lng lat for less redundant zoom calculation
    const initRouteLngLats : Array<Array<number>> = [];
    const [routeLngLats, setRouteLngLats] = useState(initRouteLngLats)
    const initStopLngLats : Array<Array<number>> = [];
    const [stopLngLats, setStopLngLats] = useState(initStopLngLats);

    useEffect(() => { // only load the map when the container is ready
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current!,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });
    });

    // =========================== user interaction with map
    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
            setLng(parseFloat(map.current!.getCenter().lng.toFixed(4)));
            setLat(parseFloat(map.current!.getCenter().lat.toFixed(4)));
            setZoom(parseFloat(map.current!.getZoom().toFixed(2)));
        });
    });

    // =========================== loading stops on route and route onto the map
    useEffect(() => {
        const markerData = convertStopsToMarker(stops)
        const newMarkers : mapboxgl.Marker[] = [];
        for (const m of markerData.features) {
            newMarkers.push( // adding markers on top (default mapboxgl js)
                new mapboxgl.Marker()
                .setLngLat(m.geometry.coordinates)
                .addTo(map.current!)
            )
        }

        // ======================= remove all current markers and replace with new
        for (const m of routeMarkers) {
            m.remove()
        }
        setRouteMarkers(newMarkers)

        // ====================== display the route route
        if (routeResponse && (stops.length >= 2)) {
            const route = routeResponse.geometry.coordinates;
            const [ newZoom, newLng, newLat ] = getMapZoomCenter(route, stopLngLats)
            if (newZoom > 0) {
                setZoom(newZoom); setLng(newLng); setLat(newLat)
                map.current!.setZoom(newZoom);
                map.current!.setCenter([newLng, newLat]);
            }
            setRouteLngLats(route);

            if (map.current!.getSource('route')) {
                (map.current!.getSource('route') as mapboxgl.GeoJSONSource).setData(
                    {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                        type: 'LineString',
                        coordinates: route
                        }
                    }
                );
            } else {
                map.current!.addLayer({
                    id: ROUTE_ID,
                    type: 'line',
                    source: {
                    type: 'geojson',
                    data: {
                            type: 'Feature',
                            properties: {},
                            geometry: {
                            type: 'LineString',
                            coordinates: route
                            }
                        }
                    },
                    layout: {
                    'line-join': 'round',
                    },
                    paint: {
                    'line-color': '#3887be',
                    'line-width': 5,
                    'line-opacity': 0.75
                    }
                })
            }
        } else {
            if (map.current!.getLayer(ROUTE_ID)) {
                map.current!.removeLayer(ROUTE_ID);
            }
            
            if (stops.length == 1) {
                const route = [markerData.features[0].geometry.coordinates];
                const [ newZoom, newLng, newLat ] = getMapZoomCenter(route, stopLngLats)
                if (newZoom > 0) {
                    setZoom(newZoom); setLng(newLng); setLat(newLat)
                    map.current!.setZoom(newZoom);
                    map.current!.setCenter([newLng, newLat]);
                }
                setRouteLngLats(route)
            }
        }
    }, [stops, routeResponse])

    // =========================== loading searched stops onto map
    useEffect(() => {
        const stopMarkerData = convertStopsToMarker(searchResults)
        const newSearchMarkers : mapboxgl.Marker[] = [];
        const newStopLngLat : Array<Array<number>> = [];
        for (const m of stopMarkerData.features) {
            // define popup content
            const popupString = "<div>".concat(m.properties.name).concat("</div>")
            newSearchMarkers.push( // adding markers on top (default mapboxgl js)
                new mapboxgl.Marker({
                    color: stopMarkerColor,
                }).setLngLat(m.geometry.coordinates)
                .addTo(map.current!)
                .setPopup(new mapboxgl.Popup({
                    closeButton: false
                }).setHTML(popupString))
            )
            newStopLngLat.push(m.geometry.coordinates)
        }
        // ======================= set the zoom
        const [ newZoom, newLng, newLat ] = getMapZoomCenter(routeLngLats, newStopLngLat)
        map.current!.setZoom(newZoom);
        map.current!.setCenter([newLng, newLat]);
        setStopLngLats(newStopLngLat);

        // ======================= remove all current markers and replace with new
        for (const m of stopMarkers) {
            m.remove()
        }
        setStopMarkers(newSearchMarkers)
    }, [searchResults])

    return (
        <div className="map-container">
            <div ref={mapContainer} className="map-itself" />
        </div>
    )
}