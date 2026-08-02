<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/auth_check.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    case 'GET':
        $categorySlug = $_GET['category'] ?? null;
        $includeUnavailable = isset($_GET['all']); // admin panel passes ?all=1

        $sql = "SELECT m.id, m.category_id, c.slug AS category_slug, c.name AS category_name,
                       m.name, m.description, m.price, m.image_url, m.is_veg, m.is_available
                FROM menu_items m
                JOIN categories c ON c.id = m.category_id";
        $conditions = [];
        $params = [];

        if (!$includeUnavailable) {
            $conditions[] = "m.is_available = 1";
        }
        if ($categorySlug) {
            $conditions[] = "c.slug = ?";
            $params[] = $categorySlug;
        }
        if ($conditions) {
            $sql .= " WHERE " . implode(" AND ", $conditions);
        }
        $sql .= " ORDER BY c.sort_order ASC, m.name ASC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        sendJson($stmt->fetchAll());
        break;

    case 'POST':
        requireAdmin();
        $body = getJsonBody();
        foreach (['category_id', 'name', 'price'] as $field) {
            if (empty($body[$field]) && $body[$field] !== 0) {
                sendJson(['error' => "Field '$field' is required"], 422);
            }
        }
        $stmt = $pdo->prepare(
            "INSERT INTO menu_items (category_id, name, description, price, image_url, is_veg, is_available)
             VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $body['category_id'],
            $body['name'],
            $body['description'] ?? '',
            $body['price'],
            $body['image_url'] ?? '',
            !empty($body['is_veg']) ? 1 : 0,
            array_key_exists('is_available', $body) ? (int)(bool)$body['is_available'] : 1,
        ]);
        sendJson(['id' => $pdo->lastInsertId(), 'message' => 'Item added'], 201);
        break;

    case 'PUT':
        requireAdmin();
        $id = $_GET['id'] ?? null;
        if (!$id) sendJson(['error' => 'Missing id parameter'], 422);
        $body = getJsonBody();

        $fields = [];
        $params = [];
        foreach (['category_id', 'name', 'description', 'price', 'image_url'] as $col) {
            if (array_key_exists($col, $body)) {
                $fields[] = "$col = ?";
                $params[] = $body[$col];
            }
        }
        if (array_key_exists('is_veg', $body)) {
            $fields[] = "is_veg = ?";
            $params[] = (int)(bool)$body['is_veg'];
        }
        if (array_key_exists('is_available', $body)) {
            $fields[] = "is_available = ?";
            $params[] = (int)(bool)$body['is_available'];
        }
        if (!$fields) sendJson(['error' => 'No fields to update'], 422);

        $params[] = $id;
        $stmt = $pdo->prepare("UPDATE menu_items SET " . implode(', ', $fields) . " WHERE id = ?");
        $stmt->execute($params);
        sendJson(['message' => 'Item updated']);
        break;

    case 'DELETE':
        requireAdmin();
        $id = $_GET['id'] ?? null;
        if (!$id) sendJson(['error' => 'Missing id parameter'], 422);
        $stmt = $pdo->prepare("DELETE FROM menu_items WHERE id = ?");
        $stmt->execute([$id]);
        sendJson(['message' => 'Item deleted']);
        break;

    default:
        sendJson(['error' => 'Method not allowed'], 405);
}
