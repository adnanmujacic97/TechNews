<?php
// Set header for JSON response
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Allow requests from Angular (localhost:4200)
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection details
$host = 'localhost';        // Usually localhost
$dbname = 'dbtechnews';     // Your database name
$username = 'root';         // Default XAMPP MySQL username
$password = '';             // Default XAMPP MySQL password is empty

try {
    // Create PDO connection
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Prepare and execute query
    $stmt = $pdo->prepare("SELECT * FROM `tbluser` WHERE UserName = :username");
    $stmt->bindValue(':username', 'Adnan97', PDO::PARAM_STR);
    $stmt->execute();

    // Fetch result
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // User found
        echo json_encode([
            "success" => true,
            "data" => $user
        ]);
    } else {
        // No user found
        echo json_encode([
            "success" => false,
            "message" => "User not found."
        ]);
    }
} catch (PDOException $e) {
    // Database error
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>