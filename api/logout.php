<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Credentials: true");

// include 'helpers/session.php';

session_destroy();

echo json_encode([
    "success" => true,
    "message" => "Logged out successfully"
]);
?>