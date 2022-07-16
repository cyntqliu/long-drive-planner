import React, {useState, useEffect} from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { convertStopsToMarker } from '../lib/mapDisplay';
import '../index.css';


mapboxgl.accessToken = process.env.REACT_APP_API_KEY !== undefined ? process.env.REACT_APP_API_KEY : '';

type MapDisplayProps = {
    stops: {}[];
    routeResponse: {[key : string] : any} | undefined;
}

const ROUTE_ID = "route";

/**
 * Right panel in the display, shows the map widget, route, and all search results
 */
export default function MapDisplay({stops, routeResponse} : MapDisplayProps) {
    const mapContainer = React.useRef(null);
    const map = React.useRef<null|mapboxgl.Map>(null);
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);
    const initialMarkers : mapboxgl.Marker[] = [];
    const [markers, setMarkers] = useState(initialMarkers);

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

    // =========================== loading stops and route onto the map
    useEffect(() => {
        const markerData = convertStopsToMarker(stops)
        const newMarkers : mapboxgl.Marker[] = [];
        for (const m of markerData.features) {
            newMarkers.push(
                new mapboxgl.Marker()
                .setLngLat(m.geometry.coordinates)
                .addTo(map.current!)
            )
        }

        // ======================= remove all current markers and replace with new
        for (const m of markers) {
            m.remove()
        }
        setMarkers(newMarkers)

        // ====================== display the route route
        if (routeResponse && (stops.length >= 2)) {
            const route = routeResponse.geometry.coordinates;

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
            if (map.current!.getSource(ROUTE_ID)) {
                map.current!.removeSource(ROUTE_ID);
            }
        }
    }, [stops, routeResponse])

    return (
        <div className="map-container">
            <div ref={mapContainer} className="map-itself" />
        </div>
    )
}