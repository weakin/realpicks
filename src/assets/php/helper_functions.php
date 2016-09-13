<?php

date_default_timezone_set('America/Los_Angeles');

function reformatDate($dateString) {
    $dateParts = explode("-", $dateString);
    return date("M jS, Y", mktime(0, 0, 0, $dateParts[1], $dateParts[2], $dateParts[0]));
}

function validateFormStringInput($formStringInput) {
    $trimedString = trim($formStringInput);
    preg_match('/(^[\w|\s]+$)/',$trimedString,$matchesString);
    return $matchesString[0];
}

function validateFormNumberInput($formNumberInput) {
    $trimedNumber = trim($formNumberInput);
    if (is_numeric($trimedNumber) && $trimedNumber >= 0) {
        preg_match('/(^\d+$)/',$trimedNumber,$matchesNumber);
        return $matchesNumber[0];
    }
    return;
}

?>
