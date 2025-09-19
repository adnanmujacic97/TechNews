<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Credentials: true");

//  include 'helpers/session.php'; // Starts session


if (isset($_SESSION['user'])) {
    echo json_encode([
        "loggedIn" => true,
        "user" => $_SESSION['user']
    ]);
} else {
    echo json_encode([
        "loggedIn" => false,
        "user" => null
    ]);
}

// error_log("Session: ". print_r($_SESSION['user'], true));
?>