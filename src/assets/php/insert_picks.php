<?php
header('Content-Type: application/json');

include 'helper_functions.php';
include 'credentials.php';

$validTeams = ["Cleveland Browns", "Buffalo Bills", "Arizona Cardinals", "Atlanta Falcons", "Denver Broncos", "New Orleans Saints", "Philadelphia Eagles", "Dallas Cowboys", "Baltimore Ravens", "Green Bay Packers", "Los Angeles Rams", "Carolina Panthers",                                                                                                                                                                                       "Chicago Bears", "Tennessee Titans", "New England Patriots", "New York Jets", "Cincinnati Bengals", "Detroit Lions", "Indianapolis Colts", "Seattle Seahawks", "Miami Dolphins", "Kansas City Chiefs", "New York Giants", "San Diego Chargers", "Minnesota Vikings",  "Pittsburgh Steelers", "Houston Texans", "Tampa Bay Buccaneers", "San Francisco 49ers", "Washington Redskins", "Jacksonville Jaguars", "Oakland Raiders"];

$formFieldsToIgnore = ['week','id','user_name','user_group'];

// the string and number validation functions are defined in helper_functions.php
$week = validateFormNumberInput($_POST['week']);
$user_name = validateFormStringInput($_POST['user_name']);
$user_group = validateFormStringInput($_POST['user_group']);
$user_id = validateFormNumberInput($_POST['id']);
$arraysToInsert = [];
foreach ($_POST as $key => $value) {
    if (in_array($key, $formFieldsToIgnore)) { continue; }
    // if someone is somehow able to slip something into the team
    // field, check to make sure the value is in the team array
    if (!in_array($value, $validTeams)) { continue; }
    $arraysToInsert[] .= "(" . $key . ", " . $week . ",'" . $value . "', '" . $user_id . "', '" . $user_name . "', '" . $user_group . "')";
}
//print_r($arraysToInsert);
$combinedInserts = implode(', ', $arraysToInsert);

$dbConn = pg_connect(getDatabaseCredentials()) or die('Could not connect: ' . pg_last_error());

$insertPicksQuery = "INSERT INTO nfl_picks (game_id, game_week, pick, user_id, user_name, user_group) VALUES $combinedInserts";
$result1 = pg_query($insertPicksQuery) or die('insertPicksQuery failed: ' . pg_last_error());

pg_close($dbConn);

$rowsAffected = pg_affected_rows($result1);

echo json_encode($rowsAffected);

?>
