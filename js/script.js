const state_default_style = {
    fillColor: null,
    weight: '3'
}

const state_selected_style = {
    fillColor: 'red',
    weight: '5' 
}

const CENTRALIZED_COORDINATES = [-54, -14.8267];
const MAP_ZOOM = 4.4;
const br_states_data = 'data/br-states.json';
const standing_chart_dataset = 'data/position_by_round_team_id.csv';
const club_goals_dataset = "data/total_goals_per_team.csv";




// Main execution when HTML DOM finishes loading
$(function() {
    const VIEWPORT_WIDTH = $('analysis-port').outerWidth();
    const VIEWPORT_HEIGHT = $('analysis-port').outerHeight();

    main(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
});

function main(VIEWPORT_WIDTH, VIEWPORT_HEIGHT) {
    let map = create_map('map', CENTRALIZED_COORDINATES[1],
                CENTRALIZED_COORDINATES[0], MAP_ZOOM);

    superimpose_geojson(br_states_data, map);

    standings_series_chart('standingsChart', standing_chart_dataset,
                            VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    goals_bar_chart('goalsChart', club_goals_dataset, VIEWPORT_WIDTH,
                    VIEWPORT_HEIGHT);
}



function create_map(html_tag, lat, long, magnification, options) {
    let options_is_set = typeof options != 'undefined'
                        && options != null
    // If options object isnt set, uses default config
    options = options_is_set ? options : {
        minZoom: magnification,
        maxZoom: magnification,
        dragging: false,
        zoomControl: false,
    };

    let map = L.map(html_tag, options).setView([lat, long], magnification);
    L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
                { attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
                maxZoom: 18}).addTo(map);
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
    state_is_selected ? current_state.setStyle(state_default_style) : current_state.setStyle(state_selected_style)
}

function standings_series_chart(html_tag, dataset, width, height){
	let standing_line_chart = dc.seriesChart("#" + html_tag);
    let ndx, runDimension, runGroup;

    d3.csv(dataset).then(function(experiments) {
        ndx = crossfilter(experiments);
        runDimension = ndx.dimension(function(d) {return [+d.clube_id, +d.rodada_id]; });
        runGroup = runDimension.group().reduceSum(function(d) { return +d.posicao; });

        standing_line_chart
            .width(width)
            .height(height)
            .chart(function(c) { return dc.lineChart(c).curve(d3.curveCardinal); })
            .x(d3.scaleLinear().domain([1,20]))
            .y(d3.scaleLinear().range([20,1]))
            .brushOn(false)
            .yAxisLabel("Posicao")
            .xAxisLabel("Rodada")
            .clipPadding(10)
            .elasticY(true)
            .dimension(runDimension)
            .group(runGroup)
            .mouseZoomable(true)
            .seriesAccessor(function(d) {return "Expt: " + d.key[0];})
            .keyAccessor(function(d) {return +d.key[1];})
            .valueAccessor(function(d) {return +d.value;});
            //.legend(dc.legend().x(350).y(350).itemHeight(13).gap(5).horizontal(1).legendWidth(140).itemWidth(70))
            //standing_line_chart.yAxis().tickFormat(function(d) {return d3.format(',d')(d+299500);});

        standing_line_chart.margins().left += 40;
        standing_line_chart.ordering(function(d) { return -d.value; });

        standing_line_chart.render();
    });
}

function goals_bar_chart(html_tag, dataset, width, height){
    let goals_bar_chart = dc.barChart('#' + html_tag);

    d3.csv(dataset).then(function(data) {
        data.forEach(function(d){
            d.goals = +d.total_gols;
            d.team  = +d.clube_id;
        });

        let facts = crossfilter(data);
        let teamDimension = facts.dimension(d => d.team);
        let teamGroup = teamDimension.group().reduceSum(d => d.goals);
        let teamOrdered = teamGroup.top(Infinity).map(d => d.key);

        goals_bar_chart
            .width(width)
            .height(height)
            .margins({top: 20, right: 50, bottom: 20, left: 40})
            .x(d3.scaleOrdinal().domain(teamOrdered))
            .xUnits(dc.units.ordinal)
            .barPadding(0.4)
            .dimension(teamDimension)
            .group(teamGroup)

        goals_bar_chart.render();
    });
}
