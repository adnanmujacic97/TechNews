<?php
// api/db.php - Reusable database connection

function getDB() {
    static $pdo = null; // Reuse same connection within one request

    if ($pdo === null) {
        $host = 'localhost';
        $dbname = 'dbtechnews';
        $username = 'root';
        $password = ''; // XAMPP default

        try {
            $pdo = new PDO(
                "mysql:host=$host;dbname=$dbname;charset=utf8",
                $username,
                $password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
        } catch (PDOException $e) {
            http_response_code(500);
            die(json_encode(["error" => "Database connection failed"]));
        }
    }

    return $pdo;
}
?>