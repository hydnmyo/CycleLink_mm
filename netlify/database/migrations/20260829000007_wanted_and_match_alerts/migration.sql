CREATE TABLE IF NOT EXISTS "wanted" (
  "id" serial PRIMARY KEY NOT NULL,
  "business_id" integer NOT NULL REFERENCES "businesses"("id"),
  "title" varchar(255) NOT NULL,
  "description" text NOT NULL,
  "category" varchar(32) NOT NULL,
  "subcategory" varchar(64) NOT NULL,
  "quantity" numeric(12, 2) NOT NULL,
  "unit" varchar(16) NOT NULL,
  "city" varchar(128) NOT NULL,
  "status" varchar(16) NOT NULL DEFAULT 'active',
  "created_at" timestamp DEFAULT now()
);

ALTER TABLE "wanted"
  DROP CONSTRAINT IF EXISTS "wanted_status_check";

ALTER TABLE "wanted"
  ADD CONSTRAINT "wanted_status_check"
  CHECK ("status" IN ('active', 'filled'));

CREATE TABLE IF NOT EXISTS "match_alerts" (
  "id" serial PRIMARY KEY NOT NULL,
  "recipient_business_id" integer NOT NULL REFERENCES "businesses"("id"),
  "listing_id" integer NOT NULL REFERENCES "listings"("id"),
  "wanted_id" integer NOT NULL REFERENCES "wanted"("id"),
  "kind" varchar(32) NOT NULL,
  "created_at" timestamp DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "match_alerts_unique_recipient"
  ON "match_alerts" ("recipient_business_id", "listing_id", "wanted_id", "kind");

INSERT INTO "wanted" ("business_id", "title", "description", "category", "subcategory", "quantity", "unit", "city", "status", "created_at") VALUES
  (2, 'Looking for clean HDPE scrap in Yangon', 'Yangon Recycle Hub needs sorted HDPE drum or crate scrap for pelletizing. Prefer rinsed material, no mixed resins.', 'plastic', 'HDPE', 1.00, 'ton', 'Yangon', 'active', '2026-08-20 00:00:00'),
  (6, 'PET flakes or preform rejects — Thilawa / Yangon', 'Irrawaddy Plastics will take clear PET flake or off-spec preforms this month. Moisture under 2% preferred.', 'plastic', 'PET', 500, 'kg', 'Yangon', 'active', '2026-08-21 00:00:00'),
  (4, 'Mild or stainless offcuts for Mandalay shop', 'Mandalay Metalworks buys plate and sheet offcuts for smaller fabrication jobs. Oil-free preferred.', 'industrial', 'metal', 1.00, 'ton', 'Mandalay', 'active', '2026-08-19 00:00:00'),
  (3, 'Cotton or denim cuttings for stuffing', 'Hlaing Garment Works can use mixed cotton-rich cuttings as stuffing and industrial wipers.', 'industrial', 'textile', 400, 'kg', 'Yangon', 'active', '2026-08-18 00:00:00');
