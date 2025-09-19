<?php
// Set headers
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// include 'helpers/session.php'; // session_start()

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

// Get input
$data = json_decode(file_get_contents('php://input'), true);

$ime = trim($data['ime'] ?? '');
$prezime = trim($data['prezime'] ?? '');
$username = trim($data['username'] ?? '');
$email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);
$password = $data['password'] ?? '';

$errors = [];

// Validation
if (empty($ime)) $errors[] = "First name is required.";
if (empty($prezime)) $errors[] = "Last name is required.";
if (empty($username)) $errors[] = "Username is required.";
if (!$email) $errors[] = "Valid email is required.";
if (strlen($password) < 6) $errors[] = "Password must be at least 6 characters.";

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => implode(" ", $errors)
    ]);
    exit;
}

// Hash password
// $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Database connection
$host = 'localhost';
$dbname = 'dbtechnews';
$dbUser = 'root';
$dbPass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $dbUser, $dbPass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Check if username or email already exists
    $stmt = $pdo->prepare("SELECT * FROM tbluser WHERE UserName = ? OR Email = ?");
    $stmt->execute([$username, $email]);

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch();
        if ($row['UserName'] === $username) {
            $errors[] = "Username already taken.";
        }
        if ($row['Email'] === $email) {
            $errors[] = "Email already registered.";
        }
        http_response_code(409); // Conflict
        echo json_encode([
            "success" => false,
            "message" => implode(" ", $errors)
        ]);
        exit;
    }

    // Insert user (Role defaults to 'Reader')
    $stmt = $pdo->prepare("
        INSERT INTO tbluser (Ime, Prezime, UserName, Password, Email, Role) 
        VALUES (?, ?, ?, ?, ?, 'Reader')
    ");
    $stmt->execute([$ime, $prezime, $username, $password, $email]);

    echo json_encode([
        "success" => true,
        "message" => "Registration successful!"
    ]);

} catch (PDOException $e) {
    error_log("DB Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error. Please try again."
    ]);
}
?>