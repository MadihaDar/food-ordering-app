<?php
// scripts/seed_bulk_menu.php
//
// Adds a larger batch of synthetic menu items across the existing categories,
// so the GET /api/menu.php endpoint has more than the default 16 seed rows
// to actually query under load. Safe to run against a local dev DB only —
// do not run against production.
//
// Usage (from backend/):
//   php scripts/seed_bulk_menu.php [count]
// Default count: 300

require_once __DIR__ . '/../config/database.php';

$count = isset($argv[1]) ? (int)$argv[1] : 300;
$pdo = getDbConnection();

$categoryIds = $pdo->query("SELECT id FROM categories")->fetchAll(PDO::FETCH_COLUMN);
if (empty($categoryIds)) {
    echo "No categories found — import database.sql first.\n";
    exit(1);
}

$adjectives = ['Spicy', 'Classic', 'Deluxe', 'House Special', 'Charcoal-Grilled', 'Creamy', 'Tangy', 'Smoky'];
$nouns = ['Karahi', 'Wrap', 'Platter', 'Bowl', 'Combo', 'Skewers', 'Rice', 'Sandwich'];

$stmt = $pdo->prepare(
    "INSERT INTO menu_items (category_id, name, description, price, image_url, is_veg, is_available)
     VALUES (?, ?, ?, ?, ?, ?, 1)"
);

$pdo->beginTransaction();
for ($i = 0; $i < $count; $i++) {
    $categoryId = $categoryIds[array_rand($categoryIds)];
    $name = "{$adjectives[array_rand($adjectives)]} {$nouns[array_rand($nouns)]} #$i (Benchmark)";
    $price = rand(150, 1500);
    $isVeg = rand(0, 1);
    $stmt->execute([
        $categoryId,
        $name,
        'Synthetic menu item created for load-testing purposes.',
        $price,
        '',
        $isVeg,
    ]);
}
$pdo->commit();

$total = $pdo->query("SELECT COUNT(*) FROM menu_items")->fetchColumn();
echo "Inserted $count synthetic menu items. Total menu_items now: $total\n";