<?php
// Verifies the Authorization: Bearer <token> header against the admins table.
// Include this at the top of any endpoint that only admins should access.

require_once __DIR__ . '/database.php';

function requireAdmin(): array {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        sendJson(['error' => 'Missing or invalid Authorization header'], 401);
    }

    $token = $matches[1];
    $pdo = getDbConnection();
    $stmt = $pdo->prepare(
        "SELECT id, username FROM admins WHERE token = ? AND token_expires_at > NOW()"
    );
    $stmt->execute([$token]);
    $admin = $stmt->fetch();

    if (!$admin) {
        sendJson(['error' => 'Session expired, please log in again'], 401);
    }

    return $admin;
}
