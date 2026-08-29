ALTER TABLE "listings"
  ADD COLUMN IF NOT EXISTS "status" varchar(16) NOT NULL DEFAULT 'active';

ALTER TABLE "listings"
  DROP CONSTRAINT IF EXISTS "listings_status_check";

ALTER TABLE "listings"
  ADD CONSTRAINT "listings_status_check"
  CHECK ("status" IN ('active', 'sold'));
