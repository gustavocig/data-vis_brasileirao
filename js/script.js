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
}

// Test pending
function create_standings_series_chart(html_tag, width, height, y_dimension, group, data){
	let standing_line_chart = dc.seriesChart(html_tag);

	standing_line_chart.width(width)
					   .height(height)
					   .chart(function(c) { return dc.lineChart(c).curve(d3.curveCardinal); })
					   .x(d3.scaleLinear().domain([1,38]))
					   .brushOn(false)
					   .yAxisLabel("Posição")
					   .xAxisLabel("Rodada")
					   .clipPadding(10)
					   .elasticY(true)
					   .dimension(y_dimension)
					   .group(group)
					   .mouseZoomable(true)
					   .seriesAccessor(function(d) {return d.key[0];})
					   .keyAccessor(function(d) {return +d.key[1];})
					   .valueAccessor(function(d) {return +d.value;})
					   .legend(dc.legend().x(700).y(5).itemHeight(13).gap(5));

	return standing_line_chart;
}

// Test pending
function create_goals_bar_chart(html_tag, width, height, y_dimension, group, teams_ordered, data){
	let goals_bar_chart = dc.barChart(html_tag);

	goals_bar_chart.width(width)
	                .height(height)
	                .margins({top: 20, right: 50, bottom: 20, left: 40})
	            	.x(d3.scaleOrdinal().domain(teams_ordered))
	                .xUnits(dc.units.ordinal)
	                .barPadding(0.4)
	                .dimension(y_dimension)
	                .group(group)

	return goals_bar_chart;
}