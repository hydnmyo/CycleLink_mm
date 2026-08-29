ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "contact_person" varchar(255);
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "phone" varchar(64);
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "registration_document" varchar(255);
