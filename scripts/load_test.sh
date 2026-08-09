#!/usr/bin/env bash
# scripts/load_test.sh
#
# Load-tests the real Zaiqa PHP API using autocannon (via npx, no install
# needed). Run this AFTER Apache/MySQL are running (XAMPP/Laragon) and AFTER
# importing database.sql (and optionally seed_bulk_menu.php for a bigger
# catalog).
#
# IMPORTANT: update BASE_URL below to match wherever you placed the backend
# folder in your web root, e.g.:
#   http://localhost/food-ordering-app/backend
#
# Usage:
#   bash scripts/load_test.sh

BASE_URL="http://localhost/food-ordering-app/backend"
CONNECTIONS=20
DURATION=15

echo "=================================================="
echo "1) GET /api/menu.php  (catalog browse)"
echo "=================================================="
npx autocannon -c $CONNECTIONS -d $DURATION "$BASE_URL/api/menu.php"

echo ""
echo "=================================================="
echo "2) GET /api/categories.php"
echo "=================================================="
npx autocannon -c $CONNECTIONS -d $DURATION "$BASE_URL/api/categories.php"

echo ""
echo "=================================================="
echo "3) GET /api/menu.php?category=karahi-curry  (filtered browse)"
echo "=================================================="
npx autocannon -c $CONNECTIONS -d $DURATION "$BASE_URL/api/menu.php?category=karahi-curry"

echo ""
echo "=================================================="
echo "4) POST /api/orders.php  (place an order — real write + transaction,"
echo "   including the MAX(token_number) lookup on every request)"
echo "=================================================="
npx autocannon -c $CONNECTIONS -d $DURATION \
  -m POST \
  -H "Content-Type: application/json" \
  -b '{"customer_name":"Benchmark User","phone":"03001234567","address":"123 Test Street","order_type":"delivery","items":[{"id":1,"name":"Chicken Karahi (Half)","price":950,"quantity":1},{"id":13,"name":"Kashmiri Chai","price":200,"quantity":2}]}' \
  "$BASE_URL/api/orders.php"

echo ""
echo "Done. Copy the 'Req/Sec' and 'Latency' summary tables from each"
echo "section above — that's what goes into the benchmark report."
echo ""
echo "NOTE: test 4 creates a real row in your orders/order_items tables on"
echo "every single request during the 15s run (likely hundreds of rows)."
echo "That's expected — it's testing the real write path — but you may want"
echo "to clear out the resulting test orders afterward:"
echo "  DELETE FROM orders WHERE customer_name = 'Benchmark User';"c