<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection
// $host = 'localhost';
// $dbname = 'dbtechnews';
// $username = 'root';
// $password = '';

include 'db.php';


try {
    // $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    // $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $db = getDB();
    $requestedUsername = $_GET['username'] ?? '';
    if (!$requestedUsername) {
        http_response_code(400);
        echo json_encode(["error" => "Username is required"]);
        exit;
    }

    $stmt = $db->prepare("SELECT ID, Ime, Prezime, Username, Password, Email, Role FROM tblUser WHERE Username = ?");
    $stmt->execute([$requestedUsername]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode($user);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "User not found"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>