<?php
header('Content-Type: application/json');

include 'helper_functions.php';
include 'credentials.php';
include 'current_week.php';

$dbConn = pg_connect(getDatabaseCredentials()) or die('Could not connect: ' . pg_last_error());

// the string and number validation functions are defined in helper_functions.php
$requestedWeek = getWeek(); // this returns an array, the current week is at index[1]
$user_name = validateFormStringInput($_GET['user_name']);
$user_group = validateFormStringInput($_GET['user_group']);
$user_id = validateFormNumberInput($_GET['id']);

$query2 = "SELECT COUNT(*) FROM nfl_picks WHERE user_name='" . $user_name . "' AND user_group='" . $user_group . "' AND user_id='" . $user_id . "' AND game_week=" . $requestedWeek[1];
$result2 = pg_query($query2) or die('Query failed: ' . pg_last_error());

$arr = pg_fetch_all($result2);

pg_close($dbConn);

echo json_encode($arr);

?>
