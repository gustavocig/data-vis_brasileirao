function create_map(html_tag, lat, long, magnification, options) {
    let options_is_set = typeof options != 'undefined'
                        && options != null
    // If options object isnt set, uses default config
    options = options_is_set ? options : {
        minZoom:            magnification,
        maxZoom:            magnification,
        dragging:           false,
        zoomControl:        false,
        touchZoom:          false,
        tap:                false,
        doubleClickZoom:    false,
        boxZoom:            false,
    };

    let map = L.map(html_tag, options).setView([lat, long], magnification);
    L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
                }).addTo(map);
    return map;
}

function superimpose_geojson(dataset, map) {
    d3.json(dataset).then(function(geojson) {
        features = topojson.feature(geojson, geojson.objects.estados).features
        L.geoJson(features, {
            onEachFeature: onEachFeature
        }).addTo(map);
    });
}

function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.nome) {
        layer.bindPopup(feature.properties.nome, {
            closeButton: false, offset: L.point(0, -20)
        });
        layer.on({
            mouseover: () => layer.openPopup(),
            mouseout: () => layer.closePopup(),
            click: select_state
        });
    }
}

function select_state(element) {
    current_state = element.target
    state_is_selected = current_state.options.fillColor == 'red'
    state_is_selected ? current_state.setStyle(STATE_DEFAULT_STYLE) : current_state.setStyle(STATE_SELECTED_STYLE)
}
