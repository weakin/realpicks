<?php
header('Content-Type: application/json');

include 'helper_functions.php';
include 'credentials.php';

// the string and number validation functions are defined in helper_functions.php

$game_id = validateFormNumberInput($_GET['id']);
$winning_team = validateFormStringInput($_GET['winning_team']);


$dbConn = pg_connect(getDatabaseCredentials()) or die('Could not connect: ' . pg_last_error());

$winningPickQuery = "SELECT user_name, user_id, game_week FROM nfl_picks WHERE game_id = $game_id AND pick = '$winning_team'";
$losingPickQuery = "SELECT user_name, user_id, game_week FROM nfl_picks WHERE game_id = $game_id AND pick != '$winning_team'";

$resultWins = pg_query($winningPickQuery) or die('winningPickQuery failed: ' . pg_last_error());
$resultLosses = pg_query($losingPickQuery) or die('losingPickQuery failed: ' . pg_last_error());

$winningRowsAffected = pg_affected_rows($resultWins);
$losingRowsAffected = pg_affected_rows($resultLosses);

if ($losingRowsAffected >= 1) {
    $wrongPicks =  pg_fetch_all($resultLosses);
    foreach ($wrongPicks as $keyL => $valueL) {
        $weekColumnL = 'week_' . $valueL['game_week'] . '_ls';
        $updateLoser = "UPDATE user_stats SET $weekColumnL = coalesce($weekColumnL + 1, $weekColumnL, 1), total_ls = coalesce(total_ls + 1, total_ls, 1) WHERE user_name = '" . $valueL['user_name'] . "' AND user_id = " . $valueL['user_id'] . "";
        $resultUpdateLoser = pg_query($updateLoser) or die('updateLoser failed: ' . pg_last_error());
    }
}

if ($winningRowsAffected >= 1) {
    $rightPicks =  pg_fetch_all($resultWins);
    foreach ($rightPicks as $keyW => $valueW) {
        $weekColumnW = 'week_' . $valueW['game_week'] . '_wn';
        $updateWinner = "UPDATE user_stats SET $weekColumnW = coalesce($weekColumnW + 1, $weekColumnW, 1), total_wn = coalesce(total_wn + 1, total_wn, 1) WHERE user_name = '" . $valueW['user_name'] . "' AND user_id = " . $valueW['user_id'] . "";
        $resultUpdateWinner = pg_query($updateWinner) or die('updateWinner failed: ' . pg_last_error());
    }
}

pg_close($dbConn);

echo json_encode([$winningRowsAffected, $losingRowsAffected]);

?>
