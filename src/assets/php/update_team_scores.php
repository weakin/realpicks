<?php
header('Content-Type: application/json');

include 'helper_functions.php';
include 'credentials.php';

// the string and number validation functions are defined in helper_functions.php

if (isset($_POST['tie'])) { // deal with the edge case of a tie first
    $winning_score = validateFormNumberInput($_POST['tie_score_1']);
    $losing_score = $winning_score;
    $winning_team = validateFormStringInput($_POST['tie_team_1']);
    $losing_team = validateFormStringInput($_POST['tie_team_2']);
} else {
    $winning_team = validateFormStringInput($_POST['winning_team']);
    $winning_score = validateFormNumberInput($_POST['winning_score']);
    $losing_team = validateFormStringInput($_POST['losing_team']);
    $losing_score = validateFormNumberInput($_POST['losing_score']);
}

$game_week = validateFormNumberInput($_POST['game_week']);

$weekScoredToUpdate = 'week_' . $game_week . '_sc';
$weekSurrenderedToUpdate = 'week_' . $game_week . '_sr';

$weeklyAvgPointsScoredWinner = "week_" . $game_week . "_sc_avg=(coalesce(total_points_scored+$winning_score, $winning_score)/coalesce(games_played + 1, 1))";
$weeklyAvgPointsScoredLoser = "week_" . $game_week . "_sc_avg=(coalesce(total_points_scored+$losing_score, $losing_score)/coalesce(games_played + 1, 1))";

$weeklyAvgPointsSurrenderdWinner = "week_" . $game_week . "_sr_avg=(coalesce(total_points_surrendered+$losing_score, $losing_score)/coalesce(games_played + 1, 1))";
$weeklyAvgPointsSurrenderdLoser = "week_" . $game_week . "_sr_avg=(coalesce(total_points_surrendered+$winning_score, $winning_score)/coalesce(games_played + 1, 1))";


$winningTeamQuery = "UPDATE team_scores_by_week SET $weekScoredToUpdate=$winning_score, $weekSurrenderedToUpdate=$losing_score, $weeklyAvgPointsScoredWinner, $weeklyAvgPointsSurrenderdWinner, total_points_scored=coalesce(total_points_scored + $winning_score, $winning_score), total_points_surrendered=coalesce(total_points_surrendered + $losing_score, $losing_score), games_played=coalesce(games_played + 1, 1) WHERE team_name = '$winning_team'";
$losingTeamQuery = "UPDATE team_scores_by_week SET $weekScoredToUpdate=$losing_score, $weekSurrenderedToUpdate=$winning_score, $weeklyAvgPointsScoredLoser, $weeklyAvgPointsSurrenderdLoser, total_points_scored=coalesce(total_points_scored + $losing_score, $losing_score), total_points_surrendered=coalesce(total_points_surrendered + $winning_score, $winning_score), games_played=coalesce(games_played + 1, 1) WHERE team_name = '$losing_team'";

$dbConn = pg_connect(getDatabaseCredentials()) or die('Could not connect: ' . pg_last_error());

$resultWins = pg_query($winningTeamQuery) or die('winningPickQuery failed: ' . pg_last_error());
$resultLosses = pg_query($losingTeamQuery) or die('losingPickQuery failed: ' . pg_last_error());

$winningRowsAffected = pg_affected_rows($resultWins);
$losingRowsAffected = pg_affected_rows($resultLosses);

pg_close($dbConn);

echo json_encode([$winningRowsAffected, $losingRowsAffected]);

?>
