<?php

$dbConn = pg_connect(getDatabaseCredentials()) or die('Could not connect: ' . pg_last_error());

function getWeek($gameWeekFromGet = '') {
    $queryStringWeek = 0;
    $requestedWeek;
    $acceptableGameWeeks = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21];
    // If I don't use this, php gives me a warning
    date_default_timezone_set('America/Los_Angeles');

    // if a user sends in a week request via queryString, in needs to be in the acceptableGameWeeks array
    if (isset($gameWeekFromGet) && in_array($gameWeekFromGet,$acceptableGameWeeks)) {
        $queryStringWeek = $gameWeekFromGet;
    }

    // get todays date, and then current game week
    $todaysDate = date('o-m-d');
    // geting current game week means using the todays date in the $currentWeekQuery
    $currentWeekQuery = "SELECT game_week FROM nfl_weeks WHERE game_week_start <= '$todaysDate' AND '$todaysDate' <= game_week_end";
    $result1 = pg_query($currentWeekQuery) or die('currentWeekQuery failed: ' . pg_last_error());
    // Performing SQL query
    $currentWeekResultSet = pg_fetch_all($result1);
    $currentWeek = $currentWeekResultSet[0]['game_week'];

    # the defaul behavior is for the requested week to be the current week
    # but if the user requests a valid week, use that instead
    $requestedWeek = $currentWeek;
    if ($queryStringWeek > 0 && $queryStringWeek != $currentWeek) {
        $requestedWeek = $queryStringWeek;
    }

    return [$requestedWeek,$currentWeek];

}

?>
