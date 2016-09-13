<?php
header('Content-Type: application/json');

include 'helper_functions.php';
include 'credentials.php';
include 'current_week.php';

$dbConn = pg_connect(getDatabaseCredentials()) or die('Could not connect: ' . pg_last_error());

$gamePicksSortedByUser = [];
$requestedWeek;
$requestedWeek = getWeek($_GET['week']);
$userGroup = validateFormStringInput($_GET['group']);
$requestedWeekKey = 'week_' . $requestedWeek[0];

$getPicks = 'SELECT nfl_season.id, nfl_season.home_team, nfl_season.away_team, nfl_season.winning_team, nfl_season.losing_team, nfl_season.winning_score, nfl_season.losing_score, nfl_season.game_day_of_week, nfl_season.game_date, nfl_picks.pick, nfl_picks.user_name FROM nfl_picks INNER JOIN nfl_season ON nfl_season.id = nfl_picks.game_id WHERE nfl_season.game_week = ' . $requestedWeek[0] . ' AND nfl_picks.user_group = \'' . $userGroup . '\' ORDER BY nfl_season.game_day_of_week, nfl_season.game_time DESC';

$picksResult = pg_query($getPicks) or die('Query failed: ' . pg_last_error());

$arr = pg_fetch_all($picksResult);

pg_close($dbConn);

/*
** if the query didn't return a result, tell the caller that, and exit
*/
if($arr == false) {
    echo json_encode("no result returned");
    die();
};

$gamePicksSortedByUser['current_week'] = $requestedWeek[1];
$gamePicksSortedByUser['requested_week'] = $requestedWeek[0];
// the $gamePicksSortedByUser[week_*] key won't exist in the rows
// pulled from the database, so create it here before using it in the loop
$gamePicksSortedByUser['week_and_users'][] = $requestedWeekKey;
$gamePicksSortedByUser[$requestedWeekKey] = [];

foreach ($arr as $key => $value) {
    /*
    ** get the user name and pick and trim them, because the trailing spaces
    ** are causing problems on the client-side javascript
    */
    $user_name = trim($value['user_name']);
    $pick = trim($value['pick']);
    /*
    ** First get all the users, and put them in the $gamePicksSortedByUser['week_and_users']
    ** array, then make each user name an array of it's own to hold the picks
    */
    if (!in_array($user_name, $gamePicksSortedByUser['week_and_users'])) {
        $gamePicksSortedByUser['week_and_users'][] = $user_name;
        $gamePicksSortedByUser[$user_name] = [];
    }
    /*
    ** assign the entire result row value to the game week object, but only assign the
    ** pick and the id the the individual user objects
    */
    if (!array_key_exists($value['id'], $gamePicksSortedByUser[$requestedWeekKey])) {
        $gamePicksSortedByUser[$requestedWeekKey][$value['id']] = $value;
        // I could reformat the game date on the client, but I already
        // have a function that does that in php, so take care of  it here
        $gamePicksSortedByUser[$requestedWeekKey][$value['id']]['game_date'] = reformatDate($value['game_date']);
    }
    $gamePicksSortedByUser[$user_name][] = ['pick' => $pick, 'id' => $value['id']];
}


echo json_encode($gamePicksSortedByUser);

?>
