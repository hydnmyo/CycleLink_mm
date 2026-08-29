import { integer, numeric, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const businesses = pgTable('businesses', {
  id: serial().primaryKey(),
  identityUserId: varchar('identity_user_id', { length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  industry: varchar({ length: 255 }).notNull(),
  city: varchar({ length: 128 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  contactPerson: varchar('contact_person', { length: 255 }),
  phone: varchar({ length: 64 }),
  registrationDocument: varchar('registration_document', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
})

export const listings = pgTable('listings', {
  id: serial().primaryKey(),
  businessId: integer('business_id')
    .notNull()
    .references(() => businesses.id),
  title: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  category: varchar({ length: 32 }).notNull(),
  subcategory: varchar({ length: 64 }).notNull(),
  quantity: numeric('quantity', { precision: 12, scale: 2 }).notNull(),
  unit: varchar({ length: 16 }).notNull(),
  priceMmk: integer('price_mmk'),
  condition: varchar({ length: 16 }).notNull(),
  city: varchar({ length: 128 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const inquiries = pgTable('inquiries', {
  id: serial().primaryKey(),
  listingId: integer('listing_id')
    .notNull()
    .references(() => listings.id),
  buyerBusinessId: integer('buyer_business_id')
    .notNull()
    .references(() => businesses.id),
  message: text().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export type BusinessRow = typeof businesses.$inferSelect
export type ListingRow = typeof listings.$inferSelect
export type InquiryRow = typeof inquiries.$inferSelect
