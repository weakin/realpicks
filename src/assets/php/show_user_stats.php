<?php
header('Content-Type: application/json');

include 'helper_functions.php';
include 'credentials.php';
include 'current_week.php';

// the string and number validation functions are defined in helper_functions.php

$week = validateFormNumberInput($_GET['week']);
$userGroup = validateFormStringInput($_GET['group']);
$requestedWeek = getWeek($_GET['week']);

if ($week == 0) {
    $week = $requestedWeek[1];
}

$winningPicks = 'week_' . $week . '_wn';
$losingPicks = 'week_' . $week . '_ls';

$dbConn = pg_connect(getDatabaseCredentials()) or die('Could not connect: ' . pg_last_error());

$weeklyPicksStatsQuery = "SELECT user_name, $winningPicks, $losingPicks FROM user_stats WHERE user_group = '$userGroup' ORDER BY coalesce($winningPicks,0) DESC, user_name ASC";
$totalPicksStatsQuery = "SELECT user_name, total_wn, total_ls FROM user_stats WHERE user_group = '$userGroup' ORDER BY coalesce(total_wn,0) DESC";
$weeklyAliasQuery = "SELECT game_week_alias FROM nfl_weeks WHERE game_week = $week";

$weeklyPicks = pg_query($weeklyPicksStatsQuery) or die('weeklyPicksStatsQuery failed: ' . pg_last_error());
$totalPicks = pg_query($totalPicksStatsQuery) or die('totalPicksStatsQuery failed: ' . pg_last_error());
$gameWeekAlias = pg_query($weeklyAliasQuery) or die('weeklyAliasQuery failed: ' . pg_last_error());

pg_close($dbConn);

$weeklyPicksRowsAffected = pg_affected_rows($weeklyPicks);
$totalPicksRowsAffected = pg_affected_rows($totalPicks);

if ($weeklyPicksRowsAffected == 0 && $totalPicksRowsAffected == 0) {
    echo json_encode([]);
    exit();
}

$weekPicksArray = pg_fetch_all($weeklyPicks);
$totalPicksArray = pg_fetch_all($totalPicks);
$gameWeekAliasArray = pg_fetch_all($gameWeekAlias);

$weeklyStandings = [];
$totalStandings = [];
$allStandings = [];

foreach($weekPicksArray as $key => $value) {
    if ($value[$winningPicks] == null) {
        $value[$winningPicks] = 0;
    }
    if ($value[$losingPicks] == null) {
        $value[$losingPicks] = 0;
    }
    $weeklyStandings[trim($value['user_name'])] = $value[$winningPicks] . ' - ' . $value[$losingPicks];
}

foreach($totalPicksArray as $key2 => $value2) {
    if ($value2['total_wn'] == null) {
        $value2['total_wn'] = 0;
    }
    if ($value2['total_ls'] == null) {
        $value2['total_ls'] = 0;
    }
    $totalStandings[trim($value2['user_name'])] = $value2['total_wn'] . ' - ' . $value2['total_ls'];
}

$allStandings['week'] = $weeklyStandings;
$allStandings['total'] = $totalStandings;
$allStandings['current_week'] = $requestedWeek[1];
$allStandings['requested_week'] = $requestedWeek[0];
$allStandings['game_week_alias'] = trim($gameWeekAliasArray[0]['game_week_alias']);

echo json_encode($allStandings);

?>
