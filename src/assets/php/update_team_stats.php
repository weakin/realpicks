<?php
header('Content-Type: application/json');

include 'helper_functions.php';
include 'credentials.php';

$tie = $divisionGame = false;
$divisionWin = $divisionLoss = $divisionTie = '';
$winningTeamName = $losingTeamName = '';
$previousWinsTotal = $previouLossesTotal = $previousTiesTotal = 0;
$previousHomeWinsTotal = $previouHomeLossesTotal = $previousHomeTiesTotal = 0;
$previousAwayWinsTotal = $previouAwayLossesTotal = $previousAwayTiesTotal = 0;
$previousDivisionWinsTotal = $previouDivisionLossesTotal = $previousDivisionTiesTotal = 0;
$gamesPlayed = 1;

if (isset($_POST['tie'])) { // deal with the edge case of a tie first
    $losing_score = validateFormNumberInput($_POST['tie_score_1']);
    $winning_score = $losing_score;
    $winning_team = validateFormStringInput($_POST['tie_team_1']);
    $losing_team = validateFormStringInput($_POST['tie_team_2']);
    $tie = true;
} else {
    $winning_team = validateFormStringInput($_POST['winning_team']);
    $winning_team_division = validateFormStringInput($_POST['winning_team_division']);
    $winning_score = validateFormNumberInput($_POST['winning_score']);
    $losing_team = validateFormStringInput($_POST['losing_team']);
    $losing_team_division = validateFormStringInput($_POST['losing_team_division']);
    $losing_score = validateFormNumberInput($_POST['losing_score']);
}

$game_week = validateFormNumberInput($_POST['game_week']);
$home_team = validateFormStringInput($_POST['home_team']);
$away_team = validateFormStringInput($_POST['away_team']);
$home_team_division = validateFormStringInput($_POST['home_team_division']);
$away_team_division = validateFormStringInput($_POST['away_team_division']);

$gamesPlayed = "games_played=coalesce(games_played + 1, 1)";
$wins = "wins=coalesce(wins + 1, 1)";
$losses = "losses=coalesce(losses + 1, 1)";
$ties = "ties=coalesce(ties + 1, 1)";
$homeWins = "home_wins=coalesce(home_wins + 1, 1)";
$homeLosses = "home_losses=coalesce(home_losses + 1, 1)";
$homeTies = "home_ties=coalesce(home_ties + 1, 1)";
$awayWins = "away_wins=coalesce(away_wins + 1, 1)";
$awayLosses = "away_losses=coalesce(away_losses + 1, 1)";
$awayTies = "away_ties=coalesce(away_ties + 1, 1)";
$streakCount = "streak=coalesce(streak + 1, 1)";
$streakWon = "streak_type='won'";
$streakLost = "streak_type='lost'";
$streakTied = "streak_type='tied'";
$totalPointsScoredWinner = "total_points_scored=coalesce(total_points_scored+$winning_score, $winning_score)";
$totalPointsScoredLoser = "total_points_scored=coalesce(total_points_scored+$losing_score, $losing_score)";
$totalPointsScoredTie = $totalPointsScoredWinner;
$totalPointsSurrenderdWinner = "total_points_surrendered=coalesce(total_points_surrendered+$losing_score, $losing_score)";
$totalPointsSurrenderdLoser = "total_points_surrendered=coalesce(total_points_surrendered+$winning_score, $winning_score)";
$totalPointsSurrenderdTie = $totalPointsSurrenderdWinner;
$averagesPointsScoredWinner = "average_points_scored_per_game=(coalesce(total_points_scored+$winning_score, $winning_score)/coalesce(games_played + 1, 1))";
$averagesPointsScoredLoser = "average_points_scored_per_game=(coalesce(total_points_scored+$losing_score, $losing_score)/coalesce(games_played + 1, 1))";
$averagesPointsScoredTie = $averagesPointsScoredWinner;
$averagesPointsSurrenderdWinner = "average_points_surrendered_per_game=(coalesce(total_points_surrendered+$losing_score, $losing_score)/coalesce(games_played + 1, 1))";
$averagesPointsSurrenderdLoser = "average_points_surrendered_per_game=(coalesce(total_points_surrendered+$winning_score, $winning_score)/coalesce(games_played + 1, 1))";
$averagesPointsSurrenderdTie = $averagesPointsSurrenderdWinner;

if ($home_team_division === $away_team_division) {
    $divisionGame = true;
    $divisionWin = "division_wins=coalesce(division_wins + 1, 1),";
    $divisionLoss = "division_losses=coalesce(division_losses + 1, 1),";
    $divisionTie = "division_ties=coalesce(division_ties + 1, 1),";
}

function homeTeamWinnning($streak, $streakType) {
    global $gamesPlayed, $divisionWin, $wins, $homeWins, $totalPointsScoredWinner, $totalPointsSurrenderdWinner, $averagesPointsScoredWinner, $averagesPointsSurrenderdWinner;
    return "$gamesPlayed, $divisionWin $streak, $streakType, $wins, $homeWins, $totalPointsScoredWinner, $totalPointsSurrenderdWinner, $averagesPointsScoredWinner, $averagesPointsSurrenderdWinner";
}

function homeTeamLosing($streak, $streakType) {
    global $gamesPlayed, $divisionLoss, $losses, $homeLosses, $totalPointsScoredLoser, $totalPointsSurrenderdLoser, $averagesPointsScoredLoser, $averagesPointsSurrenderdLoser;
    return "$gamesPlayed, $divisionLoss $streak, $streakType, $losses, $homeLosses, $totalPointsScoredLoser, $totalPointsSurrenderdLoser, $averagesPointsScoredLoser, $averagesPointsSurrenderdLoser";
}

function homeTeamTie($streak, $streakType) {
    global $gamesPlayed, $divisionTie, $ties, $homeTies, $totalPointsScoredTie, $averagesPointsScoredTie, $totalPointsSurrenderdTie, $averagesPointsSurrenderdTie;
    return "$gamesPlayed, $divisionTie $ties, $homeTies, $streak, $streakType, $totalPointsScoredTie, $averagesPointsScoredTie, $totalPointsSurrenderdTie, $averagesPointsSurrenderdTie";
}

function awayTeamWinnning($streak, $streakType) {
    global $gamesPlayed, $divisionWin, $wins, $awayWins, $totalPointsScoredWinner, $totalPointsSurrenderdWinner, $averagesPointsScoredWinner, $averagesPointsSurrenderdWinner;
    return "$gamesPlayed, $divisionWin $streak, $streakType, $wins, $awayWins, $totalPointsScoredWinner, $totalPointsSurrenderdWinner, $averagesPointsScoredWinner, $averagesPointsSurrenderdWinner";
}

function awayTeamLosing($streak, $streakType) {
    global $gamesPlayed, $divisionLoss, $losses, $awayLosses, $totalPointsScoredLoser, $totalPointsSurrenderdLoser, $averagesPointsScoredLoser, $averagesPointsSurrenderdLoser;
    return "$gamesPlayed, $divisionLoss $streak, $streakType, $losses, $awayLosses, $totalPointsScoredLoser, $totalPointsSurrenderdLoser, $averagesPointsScoredLoser, $averagesPointsSurrenderdLoser";
}

function awayTeamTie($streak, $streakType) {
    global $gamesPlayed, $divisionTie, $ties, $awayTies, $totalPointsScoredTie, $averagesPointsScoredTie, $totalPointsSurrenderdTie, $averagesPointsSurrenderdTie;
    return "$gamesPlayed, $divisionTie $ties, $awayTies, $streak, $streakType, $totalPointsScoredTie, $averagesPointsScoredTie, $totalPointsSurrenderdTie, $averagesPointsSurrenderdTie";
}

if ($home_team === $winning_team && $tie !== true) {
    $homeInfo = homeTeamWinnning($streakCount,$streakWon);
    $awayInfo = awayTeamLosing($streakCount,$streakLost);
} else if ($away_team === $winning_team && $tie !== true) {
    $homeInfo = homeTeamLosing($streakCount,$streakLost);
    $awayInfo = awayTeamWinnning($streakCount,$streakWon);
} else if ($tie === true) {
    $homeInfo = homeTeamTie($streakCount,$streakTied);
    $awayInfo = awayTeamTie($streakCount,$streakTied);
}

$dbConn = pg_connect(getDatabaseCredentials()) or die('Could not connect: ' . pg_last_error());

if ($game_week == 1) {
    $setTeamStats1 = "UPDATE team_stats SET $homeInfo WHERE team_name = '$home_team'";
    $setTeamStats2 = "UPDATE team_stats SET $awayInfo WHERE team_name = '$away_team'";

    $result1 = pg_query($setTeamStats1) or die('setTeamStats1 failed: ' . pg_last_error());
    $result2 = pg_query($setTeamStats2) or die('setTeamStats2 failed: ' . pg_last_error());

    pg_close($dbConn);

    $rowsAffected1 = pg_affected_rows($result1);
    $rowsAffected2 = pg_affected_rows($result2);

    echo json_encode([$rowsAffected1,$rowsAffected2]);
    die();
}

$getHomeTeamStreakTypeQuery = "SELECT streak_type FROM team_stats WHERE team_name = '$home_team'";
$getAwayTeamStreakTypeQuery = "SELECT streak_type FROM team_stats WHERE team_name = '$away_team'";

$homeStreakQ = pg_query($getHomeTeamStreakTypeQuery) or die('getHomeTeamStreakTypeQuery failed: ' . pg_last_error());
$awayStreakQ = pg_query($getAwayTeamStreakTypeQuery) or die('getAwayTeamStreakTypeQuery failed: ' . pg_last_error());

$homeStreakResult = pg_fetch_all($homeStreakQ);
$awayStreakResult = pg_fetch_all($awayStreakQ);

$homeStreakType = trim($homeStreakResult[0]['streak_type']);
$awayStreakType = trim($awayStreakResult[0]['streak_type']);

if ($home_team === $winning_team && $tie !== true) {
    $homeInfo = homeTeamWinnning($streakCount,$streakWon);
    $awayInfo = awayTeamLosing($streakCount,$streakLost);
    if ($homeStreakType != 'won') {
        $homeInfo = homeTeamWinnning('streak=1',$streakWon);
    }
    if ($awayStreakType != 'lost') {
        $awayInfo = awayTeamLosing('streak=1',$streakLost);
    }
} else if ($away_team === $winning_team && $tie !== true) {
    $homeInfo = homeTeamLosing($streakCount,$streakLost);
    $awayInfo = awayTeamWinnning($streakCount,$streakWon);
    if ($homeStreakType != 'lost') {
        $homeInfo = homeTeamLosing('streak=1',$streakLost);
    }
    if ($awayStreakType != 'won') {
        $awayInfo = awayTeamWinnning('streak=1',$streakWon);
    }
} else if ($tie === true) {
    $homeInfo = homeTeamTie($streakCount,$streakTied);
    $awayInfo = awayTeamTie($streakCount,$streakTied);
    if ($homeStreakType != 'tied') {
        $homeInfo = homeTeamTie('streak=1',$streakTied);
    }
    if ($awayStreakType != 'tied') {
        $awayInfo = awayTeamTie('streak=1',$streakTied);
    }
}

$setTeamStats1 = "UPDATE team_stats SET $homeInfo WHERE team_name = '$home_team'";
$setTeamStats2 = "UPDATE team_stats SET $awayInfo WHERE team_name = '$away_team'";

$result1 = pg_query($setTeamStats1) or die('setTeamStats1 failed: ' . pg_last_error());
$result2 = pg_query($setTeamStats2) or die('setTeamStats2 failed: ' . pg_last_error());

pg_close($dbConn);

$rowsAffected1 = pg_affected_rows($result1);
$rowsAffected2 = pg_affected_rows($result2);

echo json_encode([$rowsAffected1,$rowsAffected2]);

?>
