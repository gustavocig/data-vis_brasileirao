let state_default_style = {
    fillColor: null,
    weight: '3'
}

let state_selected_style = {
    fillColor: 'red',
    weight: '5' 
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
    state_is_selected ? current_state.setStyle(default_style) : current_state.setStyle(selected_style)
}

function standings_series_chart(html_tag, dataset, width=768, height=480){
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