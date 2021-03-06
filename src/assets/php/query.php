<?php
header('Content-Type: application/json');

include 'helper_functions.php';
include 'credentials.php';
include 'current_week.php';

$dbConn = pg_connect(getDatabaseCredentials()) or die('Could not connect: ' . pg_last_error());

$gameWeek = [];
$requestedWeek;
$requestedWeek = getWeek($_GET['week']);

$query3 = 'SELECT nfl_season.id, nfl_season.game_week, nfl_season.game_date, nfl_season.game_day_of_week, nfl_season.game_location, nfl_season.game_time, nfl_season.home_team, nfl_season.away_team, nfl_season.home_team_division, nfl_season.away_team_division, nfl_season.home_team_conference, nfl_season.away_team_conference, nfl_season.winning_team, nfl_season.losing_team, nfl_season.winning_score, nfl_season.losing_score, nfl_weeks.game_week_alias FROM nfl_season INNER JOIN nfl_weeks ON nfl_season.game_week = nfl_weeks.game_week WHERE nfl_season.game_week = ' . $requestedWeek[0] . ' ORDER BY game_date, game_time';
$result2 = pg_query($query3) or die('Query failed: ' . pg_last_error());

$arr = pg_fetch_all($result2);

pg_close($dbConn);

// iterate over the result set, and build an associative array
// to be converted into JSON and returned to the client
foreach ($arr as $key => $value) {
    $arr[$key]['game_date'] = reformatDate($value['game_date']);
    $arr[$key]['requested_week'] = $requestedWeek[0];
    $arr[$key]['current_week'] = $requestedWeek[1];
    $gameWeek[]= $arr[$key];
}

echo json_encode($gameWeek);

?>
