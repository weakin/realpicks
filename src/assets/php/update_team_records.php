<?php
header('Content-Type: application/json');

include 'helper_functions.php';
include 'credentials.php';

// the string and number validation functions are defined in helper_functions.php

$tie = false;
if (isset($_POST['tie'])) { // deal with the edge case of a tie first
    $winning_team = validateFormStringInput($_POST['tie_team_1']);
    $losing_team = validateFormStringInput($_POST['tie_team_2']);
    $tie = true;
} else {
    $winning_team = validateFormStringInput($_POST['winning_team']);
    $losing_team = validateFormStringInput($_POST['losing_team']);
}

$game_week = validateFormNumberInput($_POST['game_week']);

$previousWeekWinsTotal = $previousWeekLossesTotal = $previousWeekTiesTotal = 0;

if ($game_week > 1) {
    $previousWeekWinsTotal = 'week_' . ($game_week - 1) . '_wn';
    $previousWeekLossesTotal = 'week_' . ($game_week - 1) . '_ls';
    $previousWeekTiesTotal = 'week_' . ($game_week - 1) . '_tie';
}
$weekWinsToUpdate = 'week_' . $game_week . '_wn';
$weekLossesToUpdate = 'week_' . $game_week . '_ls';
$weekTiesToUpdate = 'week_' . $game_week . '_tie';

$winningTeamQuery = "UPDATE team_records_by_week SET $weekWinsToUpdate=coalesce($previousWeekWinsTotal + 1, 1), $weekLossesToUpdate=$previousWeekLossesTotal, $weekTiesToUpdate=$previousWeekTiesTotal WHERE team_name = '$winning_team'";
$losingTeamQuery = "UPDATE team_records_by_week SET $weekWinsToUpdate=$previousWeekWinsTotal, $weekLossesToUpdate=coalesce($previousWeekLossesTotal + 1, 1), $weekTiesToUpdate=$previousWeekTiesTotal WHERE team_name = '$losing_team'";

if ($tie == true) {
    $winningTeamQuery = "UPDATE team_records_by_week SET $weekWinsToUpdate=$previousWeekWinsTotal, $weekLossesToUpdate=$previousWeekLossesTotal, $weekTiesToUpdate=coalesce($previousWeekTiesTotal + 1, 1) WHERE team_name = '$winning_team'";
    $losingTeamQuery = "UPDATE team_records_by_week SET $weekWinsToUpdate=$previousWeekWinsTotal, $weekLossesToUpdate=$previousWeekLossesTotal, $weekTiesToUpdate=coalesce($previousWeekTiesTotal + 1, 1) WHERE team_name = '$losing_team'";
}

$dbConn = pg_connect(getDatabaseCredentials()) or die('Could not connect: ' . pg_last_error());

$resultWins = pg_query($winningTeamQuery) or die('winningPickQuery failed: ' . pg_last_error());
$resultLosses = pg_query($losingTeamQuery) or die('losingPickQuery failed: ' . pg_last_error());

$winningRowsAffected = pg_affected_rows($resultWins);
$losingRowsAffected = pg_affected_rows($resultLosses);

pg_close($dbConn);

echo json_encode([$winningRowsAffected, $losingRowsAffected]);

?>
