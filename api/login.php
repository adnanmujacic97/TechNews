<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Credentials: true"); // ← Important!
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'helpers/session.php'; // Starts session

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

// Validate input
if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "All fields required"]);
    exit;
}

// Connect to DB (see next step)
include '../db.php';
$db = getDB();

// Get user from database
$stmt = $db->prepare("SELECT * FROM tbluser WHERE UserName = ?");
$stmt->execute([$username]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user['Password'])) {
    // ✅ Login successful → save user in session
    $_SESSION['user'] = [
        'id' => $user['ID'],
        'username' => $user['UserName'],
        'role' => $user['Role'], // e.g., 'Reader' or 'Admin'
        'isLoggedIn' => true
    ];

    echo json_encode([
        "success" => true,
        "message" => "Logged in!",
        "user" => $_SESSION['user']
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Invalid username or password"
    ]);
}
?>