CREATE TABLE IF NOT EXISTS "businesses" (
  "id" serial PRIMARY KEY NOT NULL,
  "identity_user_id" varchar(255) NOT NULL UNIQUE,
  "name" varchar(255) NOT NULL,
  "industry" varchar(255) NOT NULL,
  "city" varchar(128) NOT NULL,
  "email" varchar(255) NOT NULL,
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "listings" (
  "id" serial PRIMARY KEY NOT NULL,
  "business_id" integer NOT NULL REFERENCES "businesses"("id"),
  "title" varchar(255) NOT NULL,
  "description" text NOT NULL,
  "category" varchar(32) NOT NULL,
  "subcategory" varchar(64) NOT NULL,
  "quantity" numeric(12, 2) NOT NULL,
  "unit" varchar(16) NOT NULL,
  "price_mmk" integer,
  "condition" varchar(16) NOT NULL,
  "city" varchar(128) NOT NULL,
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "inquiries" (
  "id" serial PRIMARY KEY NOT NULL,
  "listing_id" integer NOT NULL REFERENCES "listings"("id"),
  "buyer_business_id" integer NOT NULL REFERENCES "businesses"("id"),
  "message" text NOT NULL,
  "created_at" timestamp DEFAULT now()
);
