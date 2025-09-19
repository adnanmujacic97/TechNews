<?php
// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: http://localhost:4200");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");
//     exit(0);
// }

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db.php';           // DB connection
include 'helpers/session.php'; // Starts session securely

$data = json_decode(file_get_contents('php://input'), true);
$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';

error_log("Raw input: " . file_get_contents('php://input'));
error_log("Decoded data: " . print_r($data, true));
error_log("Request method: " . $_SERVER['REQUEST_METHOD']);

error_log("username: ". print_r($username, true));
error_log("password: ". print_r($password, true));

// Validate input
if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "All fields are required."
    ]);
    exit;
}

try {
    $db = getDB();
    $stmt = $db->prepare("SELECT ID, Ime, Prezime, UserName, Email, Role, Password FROM tbluser WHERE UserName = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && $password === $user['Password']) {
        // Remove password before storing in session
        unset($user['Password']);

        $_SESSION['user'] = $user;

        echo json_encode([
            "success" => true,
            "message" => "Login successful!",
            "user" => $_SESSION['user']
        ]);

    } else {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Invalid username or password."
        ]);
    }
} catch (PDOException $e) {
    error_log("Login error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error. Please try again."
    ]);
}
?>