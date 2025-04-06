import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
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
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  phone: true,
  avatarUrl: true,
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
  listingType: text("listing_type").notNull(), // "sell" or "rent"
  rentPeriod: text("rent_period"), // "monthly", "daily", null for sale
  propertyTypeId: integer("property_type_id").notNull(),
  cityId: integer("city_id").notNull(),
  district: text("district").notNull(),
  address: text("address").notNull(),
  squareMeters: integer("square_meters").notNull(),
  roomCount: integer("room_count"),
  bathroomCount: integer("bathroom_count"),
  parkingCount: integer("parking_count"),
  isFeatured: boolean("is_featured").notNull().default(false),
  postedAt: timestamp("posted_at").notNull().defaultNow(),
  userId: integer("user_id").notNull(),
  imageUrls: text("image_urls").array().notNull(),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
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
  address: true,
  squareMeters: true,
  roomCount: true,
  bathroomCount: true,
  parkingCount: true,
  isFeatured: true,
  userId: true,
  imageUrls: true,
  latitude: true,
  longitude: true,
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
