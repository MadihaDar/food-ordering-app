<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    sendJson(['error' => 'Method not allowed'], 405);
}

$body = getJsonBody();
if (empty($body['username']) || empty($body['password'])) {
    sendJson(['error' => 'Username and password are required'], 422);
}

$stmt = $pdo->prepare("SELECT id, username, password_hash FROM admins WHERE username = ?");
$stmt->execute([$body['username']]);
$admin = $stmt->fetch();

if (!$admin || !password_verify($body['password'], $admin['password_hash'])) {
    sendJson(['error' => 'Invalid username or password'], 401);
}

$token = bin2hex(random_bytes(32));
$expiresAt = date('Y-m-d H:i:s', strtotime('+8 hours'));

$update = $pdo->prepare("UPDATE admins SET token = ?, token_expires_at = ? WHERE id = ?");
$update->execute([$token, $expiresAt, $admin['id']]);

sendJson([
    'token' => $token,
    'username' => $admin['username'],
    'expires_at' => $expiresAt,
]);
