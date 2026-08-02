<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';

$pdo = getDbConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query("SELECT id, name, slug, sort_order FROM categories ORDER BY sort_order ASC");
    sendJson($stmt->fetchAll());
}

sendJson(['error' => 'Method not allowed'], 405);
