/**
 * Defines the custom ZoomControl mapbox control
 */
import { Control } from "mapbox-gl";


class ZoomControl {
    onClick; // needed so the constructor doesn't error out

    constructor(options: {
        onClick: () => void;
    }) {
        this.onClick = options.onClick;
    }

    onAdd(map: mapboxgl.Map) {        
        const div = document.createElement("div");
        div.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
        div.innerHTML = `<button>
            <span class="mapboxgl-ctrl-icon" aria-hidden="true" title="display searched only">
                Display searched only
            </span>
        </button>`;
        div.addEventListener("click", () => this.onClick());

        return div;
    }

    onRemove(map: mapboxgl.Map) { }
}

export {ZoomControl};