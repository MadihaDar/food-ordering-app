<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/auth_check.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    // Customer places a new order
    case 'POST':
        $body = getJsonBody();
        foreach (['customer_name', 'phone', 'items'] as $field) {
            if (empty($body[$field])) sendJson(['error' => "Field '$field' is required"], 422);
        }
        if (!is_array($body['items']) || count($body['items']) === 0) {
            sendJson(['error' => 'Cart is empty'], 422);
        }

        $orderType = $body['order_type'] === 'pickup' ? 'pickup' : 'delivery';
        $deliveryFee = $orderType === 'delivery' ? 100.00 : 0.00;

        $subtotal = 0;
        foreach ($body['items'] as $item) {
            $subtotal += (float)$item['price'] * (int)$item['quantity'];
        }
        $total = $subtotal + $deliveryFee;

        $pdo->beginTransaction();
        try {
            // token_number is a friendly, human-readable order number (like a stall token)
            $tokenRow = $pdo->query("SELECT COALESCE(MAX(token_number), 100) + 1 AS next_token FROM orders")->fetch();
            $tokenNumber = $tokenRow['next_token'];

            $stmt = $pdo->prepare(
                "INSERT INTO orders (token_number, customer_name, phone, address, order_type, subtotal, delivery_fee, total, notes)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
            );
            $stmt->execute([
                $tokenNumber,
                $body['customer_name'],
                $body['phone'],
                $body['address'] ?? '',
                $orderType,
                $subtotal,
                $deliveryFee,
                $total,
                $body['notes'] ?? '',
            ]);
            $orderId = $pdo->lastInsertId();

            $itemStmt = $pdo->prepare(
                "INSERT INTO order_items (order_id, menu_item_id, item_name, price, quantity) VALUES (?, ?, ?, ?, ?)"
            );
            foreach ($body['items'] as $item) {
                $itemStmt->execute([
                    $orderId,
                    $item['id'] ?? null,
                    $item['name'],
                    $item['price'],
                    $item['quantity'],
                ]);
            }

            $pdo->commit();
            sendJson([
                'id' => $orderId,
                'token_number' => $tokenNumber,
                'total' => $total,
                'message' => 'Order placed successfully',
            ], 201);
        } catch (Exception $e) {
            $pdo->rollBack();
            sendJson(['error' => 'Could not place order: ' . $e->getMessage()], 500);
        }
        break;

    // Admin views all orders
    case 'GET':
        requireAdmin();
        $singleId = $_GET['id'] ?? null;

        if ($singleId) {
            $stmt = $pdo->prepare("SELECT * FROM orders WHERE id = ?");
            $stmt->execute([$singleId]);
            $order = $stmt->fetch();
            if (!$order) sendJson(['error' => 'Order not found'], 404);

            $itemsStmt = $pdo->prepare("SELECT * FROM order_items WHERE order_id = ?");
            $itemsStmt->execute([$singleId]);
            $order['items'] = $itemsStmt->fetchAll();
            sendJson($order);
        }

        $status = $_GET['status'] ?? null;
        $sql = "SELECT * FROM orders";
        $params = [];
        if ($status) {
            $sql .= " WHERE status = ?";
            $params[] = $status;
        }
        $sql .= " ORDER BY created_at DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        sendJson($stmt->fetchAll());
        break;

    // Admin updates order status
    case 'PUT':
        requireAdmin();
        $id = $_GET['id'] ?? null;
        if (!$id) sendJson(['error' => 'Missing id parameter'], 422);
        $body = getJsonBody();
        $allowedStatuses = ['pending', 'preparing', 'on_the_way', 'completed', 'cancelled'];
        if (empty($body['status']) || !in_array($body['status'], $allowedStatuses)) {
            sendJson(['error' => 'Invalid status value'], 422);
        }
        $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
        $stmt->execute([$body['status'], $id]);
        sendJson(['message' => 'Order status updated']);
        break;

    default:
        sendJson(['error' => 'Method not allowed'], 405);
}
