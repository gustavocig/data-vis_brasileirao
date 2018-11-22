const STATE_DEFAULT_STYLE = {
    fillColor: null,
    weight: '3'
}

const STATE_SELECTED_STYLE = {
    fillColor: 'red',
    weight: '5' 
}

const CENTRALIZED_COORDINATES = [-54, -14.8267];
const MAP_ZOOM = 3.99;
const BR_STATES_DATA = 'data/br-states.json';
const STANDING_CHART_DATA = 'data/position_by_round_team_id.csv';
const CLUB_GOALS_DATA = "data/total_goals_per_team.csv";
const CHART_HEIGHT = 500;


// Main execution when HTML DOM finishes loading
$(main);


function main() {
    let map = create_map('map', CENTRALIZED_COORDINATES[1],
                CENTRALIZED_COORDINATES[0], MAP_ZOOM);

    superimpose_geojson(BR_STATES_DATA, map);

    standings_series_chart('standingsChart', STANDING_CHART_DATA);
    goals_bar_chart('goalsChart', CLUB_GOALS_DATA);
}
