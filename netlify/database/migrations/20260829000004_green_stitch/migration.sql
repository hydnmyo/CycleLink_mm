INSERT INTO "businesses" ("identity_user_id", "name", "industry", "city", "email", "created_at")
VALUES (
  'seed-green-stitch',
  'Green Stitch Textile',
  'Textiles',
  'Yangon',
  'hello@greenstitch.mm',
  '2026-07-09 00:00:00'
);

INSERT INTO "listings" (
  "business_id",
  "title",
  "description",
  "category",
  "subcategory",
  "quantity",
  "unit",
  "price_mmk",
  "condition",
  "city",
  "created_at"
)
SELECT
  id,
  'Cotton Fabric Surplus',
  'Unused cotton fabric rolls from a Yangon cutting line. Mostly undyed and light solids, stored dry. Suitable for smaller garment shops or recycled-fiber spinning.',
  'industrial',
  'textile',
  85,
  'kg',
  382500,
  'new',
  'Yangon',
  '2026-08-24 03:00:00'
FROM "businesses"
WHERE "identity_user_id" = 'seed-green-stitch';

INSERT INTO "listings" (
  "business_id",
  "title",
  "description",
  "category",
  "subcategory",
  "quantity",
  "unit",
  "price_mmk",
  "condition",
  "city",
  "created_at"
)
SELECT
  id,
  'Denim Offcuts',
  'Indigo denim offcuts from jeans production. Cotton-rich, packed by shade. Useful for recycled yarn, patchwork, or industrial wipers.',
  'industrial',
  'textile',
  240,
  'kg',
  432000,
  'scrap',
  'Yangon',
  '2026-08-23 06:20:00'
FROM "businesses"
WHERE "identity_user_id" = 'seed-green-stitch';

INSERT INTO "listings" (
  "business_id",
  "title",
  "description",
  "category",
  "subcategory",
  "quantity",
  "unit",
  "price_mmk",
  "condition",
  "city",
  "created_at"
)
SELECT
  id,
  'Polyester Thread Cones',
  'Surplus polyester sewing-thread cones from a completed export order. Mixed colours, unused. Sold by the cone.',
  'industrial',
  'textile',
  320,
  'piece',
  384000,
  'new',
  'Yangon',
  '2026-08-21 09:10:00'
FROM "businesses"
WHERE "identity_user_id" = 'seed-green-stitch';

INSERT INTO "listings" (
  "business_id",
  "title",
  "description",
  "category",
  "subcategory",
  "quantity",
  "unit",
  "price_mmk",
  "condition",
  "city",
  "created_at"
)
SELECT
  id,
  'Metal Zippers & Trims',
  'Unused metal zippers and garment trims left after a style change. Mixed lengths. Suitable for repair shops or accessory makers.',
  'industrial',
  'metal',
  6400,
  'piece',
  1408000,
  'new',
  'Yangon',
  '2026-08-19 02:40:00'
FROM "businesses"
WHERE "identity_user_id" = 'seed-green-stitch';
