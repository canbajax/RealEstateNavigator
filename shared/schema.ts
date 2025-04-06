import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  avatarUrl: text("avatar_url"),
  role: text("role").notNull().default("agent"), // "admin" or "agent"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  phone: true,
  avatarUrl: true,
  role: true,
});

// Cities table
export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  listingCount: integer("listing_count").notNull().default(0),
});

export const insertCitySchema = createInsertSchema(cities).pick({
  name: true,
  imageUrl: true,
  listingCount: true,
});

// Property types table
export const propertyTypes = pgTable("property_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  listingCount: integer("listing_count").notNull().default(0),
});

export const insertPropertyTypeSchema = createInsertSchema(propertyTypes).pick({
  name: true,
  icon: true,
  listingCount: true,
});

// Listings table
export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  listingType: text("listing_type").notNull(), // "sale" or "rent"
  rentPeriod: text("rent_period"), // "monthly", "daily", null for sale
  propertyTypeId: integer("property_type_id").notNull(),
  cityId: integer("city_id").notNull(),
  district: text("district").notNull(),
  neighborhood: text("neighborhood"),
  address: text("address").notNull(),
  squareMeters: integer("square_meters").notNull(),
  roomCount: integer("room_count"),
  bathroomCount: integer("bathroom_count"),
  parkingCount: integer("parking_count"),
  isFeatured: boolean("is_featured").notNull().default(false),
  status: text("status", {enum: ["active", "passive"]}).notNull().default("active"),
  transactionStatus: text("transaction_status", {enum: ["available", "sold", "rented"]}).notNull().default("available"),
  postedAt: timestamp("posted_at").notNull().defaultNow(),
  userId: integer("user_id").notNull(),
  imageUrls: text("image_urls").array().notNull(),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  referenceNo: text("reference_no"),
  buildingAge: integer("building_age"),
  heatingType: text("heating_type"),
  isFurnished: boolean("is_furnished"),
  facingDirection: text("facing_direction"),
  floorNumber: integer("floor_number"),
});

export const insertListingSchema = createInsertSchema(listings).pick({
  title: true,
  description: true,
  price: true,
  listingType: true,
  rentPeriod: true,
  propertyTypeId: true,
  cityId: true,
  district: true,
  neighborhood: true,
  address: true,
  squareMeters: true,
  roomCount: true,
  bathroomCount: true,
  parkingCount: true,
  isFeatured: true,
  status: true,
  transactionStatus: true,
  userId: true,
  imageUrls: true,
  latitude: true,
  longitude: true,
  referenceNo: true,
  buildingAge: true,
  heatingType: true,
  isFurnished: true,
  facingDirection: true,
  floorNumber: true,
});

// Contact messages table
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  phone: true,
  subject: true,
  message: true,
});

// Site settings table - İletişim bilgileri, çalışma saatleri vs.
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // Ayar adı (ör: contact_info, working_hours)
  value: json("value").notNull(),        // JSON formatında ayar değeri
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettings).pick({
  name: true,
  value: true,
});

// Contact info schema for site settings
export const contactInfoSchema = z.object({
  address: z.string(),
  email: z.string().email(),
  phone: z.string(),
  whatsapp: z.string().optional(),
  facebook: z.string().url().optional(),
  twitter: z.string().url().optional(),
  instagram: z.string().url().optional(),
  linkedin: z.string().url().optional(),
});

// Working hours schema for site settings
export const workingHoursSchema = z.object({
  monday: z.object({ open: z.string(), close: z.string() }),
  tuesday: z.object({ open: z.string(), close: z.string() }),
  wednesday: z.object({ open: z.string(), close: z.string() }),
  thursday: z.object({ open: z.string(), close: z.string() }),
  friday: z.object({ open: z.string(), close: z.string() }),
  saturday: z.object({ open: z.string(), close: z.string(), isOpen: z.boolean() }),
  sunday: z.object({ open: z.string(), close: z.string(), isOpen: z.boolean() }),
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type City = typeof cities.$inferSelect;
export type InsertCity = z.infer<typeof insertCitySchema>;

export type PropertyType = typeof propertyTypes.$inferSelect;
export type InsertPropertyType = z.infer<typeof insertPropertyTypeSchema>;

export type Listing = typeof listings.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = z.infer<typeof insertSiteSettingsSchema>;

export type ContactInfo = z.infer<typeof contactInfoSchema>;
export type WorkingHours = z.infer<typeof workingHoursSchema>;
