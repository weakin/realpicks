<?php
header('Content-Type: application/json');

include 'helper_functions.php';
include 'credentials.php';

$user = validateFormStringInput($_GET['user']);
$group = validateFormStringInput($_GET['group']);

if (!isset($user) || empty($user)) {
    echo json_encode('no user');
    exit();
}

if (!isset($group) || empty($group)) {
    echo json_encode('no group');
    exit();
}

$dbConn = pg_connect(getDatabaseCredentials()) or die('Could not connect: ' . pg_last_error());

$userInfoQuery = "SELECT id, user_name, user_group, team FROM users WHERE user_name = '$user' AND user_group = '$group'";
$userInfoResult = pg_query($userInfoQuery) or die('userInfoQuery failed: ' . pg_last_error());
// Performing SQL query
$userInfoResultSet = pg_fetch_all($userInfoResult);
$validuserInfo = $userInfoResultSet[0];

pg_close($dbConn);

echo json_encode($validuserInfo);

?>
