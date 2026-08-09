# Zaiqa API: Load Test Benchmark

This benchmark measures the real Zaiqa PHP/MySQL API under concurrent load,
using autocannon, to see how the app performs beyond single-request manual
testing in a browser or Postman.

## Setup

- **Stack**: PHP 8.2 + Apache (XAMPP) + MySQL, native queries via PDO.
- **Data**: the app's default seeded catalog, plus ~300 additional synthetic
  menu items (`scripts/seed_bulk_menu.php`) spread across the 6 existing
  categories, to make the catalog-browse endpoint meaningful at more than the
  default 16 items.
- **Tool**: [autocannon](https://github.com/mcollina/autocannon), via `npx`
  — 20 concurrent connections, 15 seconds per endpoint.
- **Target**: local XAMPP dev server (`localhost`).

## Commands run

```bash
# 1. Bulk-seed the menu catalog
cd backend
php scripts/seed_bulk_menu.php 300

# 2. Start Apache + MySQL (XAMPP)

# 3. Run each load test
npx autocannon -c 20 -d 15 http://localhost/food-ordering-app/backend/api/menu.php
npx autocannon -c 20 -d 15 http://localhost/food-ordering-app/backend/api/categories.php
npx autocannon -c 20 -d 15 "http://localhost/food-ordering-app/backend/api/menu.php?category=karahi-curry"
npx autocannon -c 20 -d 15 -m POST -H "Content-Type: application/json" \
  -b '{"customer_name":"Benchmark User","phone":"03001234567","address":"123 Test Street","order_type":"delivery","items":[{"id":1,"name":"Chicken Karahi (Half)","price":950,"quantity":1},{"id":13,"name":"Kashmiri Chai","price":200,"quantity":2}]}' \
  http://localhost/food-ordering-app/backend/api/orders.php
```

## Results

| Endpoint | Avg Req/Sec | Avg Latency | p50 Latency | p99 Latency | Success Rate |
|---|---|---|---|---|---|
| `GET /api/menu.php` (full catalog, ~316 items) | 107 | 185 ms | 184 ms | 497 ms | 100% |
| `GET /api/categories.php` | 782 | 88 ms | 82 ms | 203 ms | 100% |
| `GET /api/menu.php?category=karahi-curry` (filtered) | 548 | 90 ms | 88 ms | 189 ms | 100% on clean runs* |
| `POST /api/orders.php` (place order, real DB write) | 524 | 98 ms | 88 ms | 250 ms | 100% (8,000+ concurrent writes) |

\* See note below.

## What this shows

- **`/api/categories.php`** is the fastest endpoint by far (782 req/sec) —
  it only queries 6 rows with a simple aggregate, so this is close to the
  ceiling for a lightweight query on this stack.
- **`/api/menu.php`** (unfiltered) is the slowest read endpoint (107 req/sec,
  185ms avg) because it returns the full ~316-item catalog per request —
  every request re-serializes the entire menu to JSON, which is real,
  expected cost proportional to response size (each response run measured
  in the ~100+ KB range).
- **Order placement** (`POST /api/orders.php`) held up well under concurrent
  writes: 524 req/sec at 98ms average latency with a 100% success rate
  across more than 8,000 real database writes (each creating an order row,
  order-item rows, and computing a new sequential token number inside a
  transaction) — no failures, no lock contention observed.

## A note on the filtered-category endpoint

The `menu.php?category=` endpoint showed occasional inconsistent behavior in
early testing: on two separate runs at 20 concurrent connections, roughly
30% of requests failed with elevated latency (up to ~4 seconds), while
identical re-runs at the same settings succeeded 100% of the time. This was
investigated but not conclusively resolved:

- The query itself is simple (an indexed `JOIN` + `WHERE c.slug = ?`) and
  returns *fewer* rows than the unfiltered endpoint, so it isn't a
  heavier query.
- `categories.slug` is indexed (confirmed via `SHOW INDEX FROM categories`).
- Checking MySQL's `SHOW FULL PROCESSLIST` during a live failing run showed
  no blocked, locked, or slow-running queries — MySQL itself did not appear
  to be the bottleneck.
- The failure did not reproduce at lower concurrency (5 connections ran
  clean), and reran clean at 20 connections immediately after.

Given the intermittent, non-reproducible nature and the lack of any evidence
of database-side contention, this looks more like local testing-environment
noise (Windows/WSL networking behavior running the load generator alongside
the server on the same machine) than an application-level bug — but it
wasn't fully isolated, so it's documented here as an open question rather
than a confirmed root cause.

## Caveats

- This is a **local, single-machine benchmark** — Apache, MySQL, and the load
  generator all ran on the same Windows machine, not a production deployment.
- The catalog dataset (~316 items) is synthetic/seeded for this benchmark.
- The filtered-category endpoint's intermittent failures (above) mean that
  specific result should be treated as provisional, not a fully validated
  number.