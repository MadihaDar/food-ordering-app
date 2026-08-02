<?php
// Shared headers for every API endpoint.
// In production, replace '*' with your actual frontend origin.

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

function getJsonBody(): array {
    $data = json_decode(file_get_contents("php://input"), true);
    return is_array($data) ? $data : [];
}

function sendJson($data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data);
    exit;
}
