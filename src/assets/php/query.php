<?php
header('Content-Type: application/json');

include 'helper_functions.php';
include 'credentials.php';
include 'current_week.php';

$dbConn = pg_connect(getDatabaseCredentials()) or die('Could not connect: ' . pg_last_error());

$gameWeekSortedByDay = [];
$requestedWeek;
$requestedWeek = getWeek($_GET['week']);

$query3 = 'SELECT nfl_season.id, nfl_season.game_week, nfl_season.game_date, nfl_season.game_day_of_week, nfl_season.game_location, nfl_season.game_time, nfl_season.home_team, nfl_season.away_team, nfl_season.home_team_division, nfl_season.away_team_division, nfl_season.home_team_conference, nfl_season.away_team_conference, nfl_season.winning_team, nfl_season.losing_team, nfl_season.winning_score, nfl_season.losing_score, nfl_weeks.game_week_alias FROM nfl_season INNER JOIN nfl_weeks ON nfl_season.game_week = nfl_weeks.game_week WHERE nfl_season.game_week = ' . $requestedWeek[0] . ' ORDER BY game_date, game_time';
$result2 = pg_query($query3) or die('Query failed: ' . pg_last_error());

$arr = pg_fetch_all($result2);

pg_close($dbConn);

$gameWeekSortedByDay['current_week'] = $requestedWeek[1];
$gameWeekSortedByDay['requested_week'] = $requestedWeek[0];
$gameWeekSortedByDay['game_week_alias'] = '';

// iterate over the result set, and build an associative array
// to be converted into JSON and returned to the client
foreach ($arr as $key => $value) {
    // edge case first: this case accounts for teams on thier bye week
    if (empty(trim($value['away_team']))) {
        $gameWeekSortedByDay['bye_week'][] = $value['home_team'];
    } else if (array_key_exists($value['game_day_of_week'], $gameWeekSortedByDay)) {
        $gameWeekSortedByDay[$value['game_day_of_week']][] = $arr[$key];
    } else {
        $gameWeekSortedByDay['game_days'][] = $value['game_day_of_week'];
        $gameWeekSortedByDay['game_week_alias'] = $value['game_week_alias'];
        $gameWeekSortedByDay['game_dates'][$value['game_day_of_week']] = reformatDate($value['game_date']);
        $gameWeekSortedByDay[$value['game_day_of_week']] = [];
        $gameWeekSortedByDay[$value['game_day_of_week']][] = $arr[$key];
    }
}

// if there are teams on the bye, add the 'bye_week' value
// to the 'game_days' array so we can iterate over it
if (array_key_exists('bye_week', $gameWeekSortedByDay)) {
    $gameWeekSortedByDay['game_days'][] = 'bye_week';
}

echo json_encode($gameWeekSortedByDay);

?>
