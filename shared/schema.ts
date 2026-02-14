import { pgTable, text, serial, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const personal_info = pgTable("personal_info", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  summary: text("summary"),
  email: text("email").notNull(),
  phone: text("phone"),
  linkedin: text("linkedin"),
  location: text("location"),
});

export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  location: text("location"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  description: text("description").array(),
});

export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  degree: text("degree").notNull(),
  institution: text("institution").notNull(),
  location: text("location"),
  graduationDate: text("graduation_date"),
  courses: text("courses"),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  date: text("date"),
  description: text("description").array(),
  technologies: text("technologies").array(),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  items: text("items").array().notNull(),
});

export const market_data = pgTable("market_data", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  price: numeric("price").notNull(),
  change: numeric("change").notNull(),
  changePercent: numeric("change_percent").notNull(),
  category: text("category").notNull(), // 'Stock', 'Index', 'Metal', 'Future', 'Rate'
});

export const contact_messages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===

export const insertContactMessageSchema = createInsertSchema(contact_messages).omit({ 
  id: true, 
  createdAt: true 
});

// === TYPES ===

export type PersonalInfo = typeof personal_info.$inferSelect;
export type Experience = typeof experiences.$inferSelect;
export type Education = typeof education.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type MarketData = typeof market_data.$inferSelect;
export type ContactMessage = typeof contact_messages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
