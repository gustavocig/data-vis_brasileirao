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
