<?php
header('Content-Type: application/json');

include 'helper_functions.php';
include 'credentials.php';

if (isset($_POST['tie'])) { // deal with the edge case of a tie first
    $losing_score = validateFormNumberInput($_POST['tie_score_1']);
    $winning_score = $losing_score;
    $game_id = validateFormNumberInput($_POST['id']);

    $updateGameQuery = "UPDATE nfl_season SET winning_score=$losing_score, losing_score=$losing_score, point_difference=0 WHERE id = $game_id";
    $winning_team = 'tie';
} else {
    $winning_team = validateFormStringInput($_POST['winning_team']);
    $winning_team_division = validateFormStringInput($_POST['winning_team_division']);
    $winning_team_conference = validateFormStringInput($_POST['winning_team_conference']);
    $winning_score = validateFormNumberInput($_POST['winning_score']);
    $losing_team = validateFormStringInput($_POST['losing_team']);
    $losing_team_division = validateFormStringInput($_POST['losing_team_division']);
    $losing_team_conference = validateFormStringInput($_POST['losing_team_conference']);
    $losing_score = validateFormNumberInput($_POST['losing_score']);
    $game_id = validateFormNumberInput($_POST['id']);
    $point_difference = $winning_score - $losing_score;

    $updateGameQuery = "UPDATE nfl_season SET winning_team='$winning_team', losing_team='$losing_team', winning_team_division='$winning_team_division', losing_team_division='$losing_team_division', winning_team_conference='$winning_team_conference', losing_team_conference='$losing_team_conference', winning_score=$winning_score, losing_score=$losing_score, point_difference=$point_difference WHERE id = $game_id";
}


$dbConn = pg_connect(getDatabaseCredentials()) or die('Could not connect: ' . pg_last_error());

$result1 = pg_query($updateGameQuery) or die('updateGameQuery failed: ' . pg_last_error());

pg_close($dbConn);

$rowsAffected = pg_affected_rows($result1); // <- this should only return 1

echo json_encode([$rowsAffected, $game_id, "$winning_team"]); // <- I'm returning the game ID because the javascript will need it when it calls the query that updates the user stats table

?>
