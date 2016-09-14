<?php
header('Content-Type: application/json');

include 'helper_functions.php';
include 'credentials.php';
include 'current_week.php';

$dbConn = pg_connect(getDatabaseCredentials()) or die('Could not connect: ' . pg_last_error());

$query3 = 'SELECT team_name FROM team_stats ORDER BY team_name ASC';
$result2 = pg_query($query3) or die('Query failed: ' . pg_last_error());

$arr = pg_fetch_all($result2);

pg_close($dbConn);

/*
** if the query didn't return a result, tell the caller that, and exit
*/
if($arr == false) {
    echo json_encode("no result returned");
    die();
};

$allTeams = array();
// iterate over the result set, and build an associative array
// to be converted into JSON and returned to the client
foreach ($arr as $key => $value) {
    $allTeams[] = trim($value['team_name']);
}

echo json_encode($allTeams);

?>
