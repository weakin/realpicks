<?php
header('Content-Type: application/json');

include 'helper_functions.php';
include 'credentials.php';
include 'current_week.php';

$column = validateFormStringInput($_GET['column']);
$order = validateFormStringInput($_GET['order']);
$winTypes = ['wins', 'home_wins', 'away_wins', 'division_wins'];
$lossTypes = array('wins' => 'losses', 'home_wins' => 'home_losses', 'away_wins' => 'away_losses', 'division_wins' => 'division_losses');
$sortTypes = array('DESC' => 'ASC', 'ASC' => 'DESC');
$defaultSort = 'team_conference ASC, team_division ASC, coalesce(wins,0) DESC';
$streakSort = array('DESC' => 'streak_wins DESC, streak_ties DESC, streak_losses ASC', 'ASC' => 'streak_losses DESC, streak_ties DESC, streak_wins ASC');
if (empty($column) && empty($order)) {
    $sort = $defaultSort;
} else if (!empty($column) && in_array($column, $winTypes)) {
   $sort = $column . ' ' . $order . ', ' . $lossTypes[$column] . ' ' . $sortTypes[$order];
} else if (!empty($column) && $column == 'streak') {
   $sort = $streakSort[$order];
} else {
    $sort = $column . ' ' . $order;
}

$dbConn = pg_connect(getDatabaseCredentials()) or die('Could not connect: ' . pg_last_error());

$query3 = 'SELECT team_name, team_division, team_conference, coalesce(wins,0) as wins, coalesce(losses,0) as losses, coalesce(ties,0) as ties, coalesce(home_wins,0) as home_wins, coalesce(home_losses,0) as home_losses, coalesce(away_wins,0) as away_wins, coalesce(away_losses,0) as away_losses, coalesce(division_wins,0) as division_wins, coalesce(division_losses,0) as division_losses, streak_type, streak_wins, streak_losses, streak_ties, coalesce(total_points_scored,0) as total_points_scored, coalesce(average_points_scored_per_game,0) as average_points_scored_per_game, coalesce(total_points_surrendered,0) as total_points_surrendered, coalesce(average_points_surrendered_per_game,0) as average_points_surrendered_per_game FROM team_stats ORDER BY ' . $sort;
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

$fullTeamStandings = array();

foreach ($arr as $key => $value) {
    if (trim($arr[$key]['streak_type']) == 'won') {
        $arr[$key]['streak'] = $arr[$key]['streak_wins'];
    } else if (trim($arr[$key]['streak_type']) == 'lost') {
        $arr[$key]['streak'] = $arr[$key]['streak_losses'];
    } else {
        $arr[$key]['streak'] = $arr[$key]['streak_ties'];
    }
    $fullTeamStandings[] = $arr[$key];
}

echo json_encode($fullTeamStandings);

?>
