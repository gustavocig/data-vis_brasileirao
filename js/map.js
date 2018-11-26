let selected_states = [];

function create_map(html_tag, lat, long, magnification, options) {
    let options_is_set = typeof options != 'undefined'
                        && options != null;
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
    current_state_id = current_state.feature.id;
    state_is_selected = current_state.options.fillColor == 'red'
    if (state_is_selected) {
        selected_states = selected_states.filter(state => state !== current_state_id);
        current_state.setStyle(STATE_DEFAULT_STYLE);
    } else {
        selected_states.push(current_state_id);
        current_state.setStyle(STATE_SELECTED_STYLE);
    }
    selected_club_ids = match_state_to_id(selected_states);
    goals_bar_chart('goalsChart', CLUB_GOALS_DATA, selected_club_ids);
    standings_series_chart('standingsChart', STANDING_CHART_DATA, selected_club_ids);
}

function match_state_to_id(states) {
    let club_ids = [];
    d3.csv('data/club_by_state.csv').then(function(clubs) {
        clubs.forEach(function(club) {
            if(states.includes(club.estado_id)) {
                club_ids.push(+club.id)
            }
        });
    });
    return club_ids;
}
