function standings_series_chart(html_tag, dataset) {
    let standing_line_chart = dc.seriesChart("#" + html_tag);
    let ndx, runDimension, runGroup;
    let width = $('#' + html_tag).outerWidth();
    let height = CHART_HEIGHT;

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

function goals_bar_chart(html_tag, dataset) {
    let goals_bar_chart = dc.barChart('#' + html_tag);
    let width = $('#' + html_tag).outerWidth();
    let height = CHART_HEIGHT;

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

function home_away_pie_chart(html_tag, dataset) {
	let home_away_pie_chart = dc.pieChart('#' + html_tag);
	let width = $('#' + html_tag).outerWidth();
	let height = CHART_HEIGHT;
	let goals_by_local = d3.map();

    d3.csv(dataset).then(function(data) {
        data.forEach(function(d){
            d.local = d.local
            d.goals = d.gols
        });

        let facts = crossfilter(data);

        let home_away_dimension = facts.dimension(d => "Como " + d.local);

        let home_away_group = home_away_dimension.group().reduceSum(d => d.goals);

        home_away_pie_chart
          .width(width)
          .height(height)
          .slicesCap(2)
          .innerRadius(100)
          .externalLabels(50)
          .externalRadiusPadding(50)
          .drawPaths(true)
          .dimension(home_away_dimension)
          .group(home_away_group)
          .on('pretransition', function(chart) {
        	home_away_pie_chart.selectAll('text.pie-slice').text(function(d) {
            return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
            })
        });

        home_away_pie_chart.render();
        
    });
}
