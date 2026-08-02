<?php
// Database connection settings.
// Update these to match your local MySQL setup (XAMPP/Laragon defaults shown).

define('DB_HOST', 'localhost');
define('DB_NAME', 'zaiqa_db');
define('DB_USER', 'zaiqa_user');
define('DB_PASS', 'zaiqa123');

function getDbConnection(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $pdo = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]
            );
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
            exit;
        }
    }
    return $pdo;
}
