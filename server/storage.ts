import { db } from "./db";
import {
  personal_info,
  experiences,
  education,
  projects,
  skills,
  market_data,
  contact_messages,
  type PersonalInfo,
  type Experience,
  type Education,
  type Project,
  type Skill,
  type MarketData,
  type InsertContactMessage
} from "@shared/schema";

export interface IStorage {
  getPersonalInfo(): Promise<PersonalInfo | undefined>;
  getExperiences(): Promise<Experience[]>;
  getEducation(): Promise<Education[]>;
  getProjects(): Promise<Project[]>;
  getSkills(): Promise<Skill[]>;
  getMarketData(): Promise<MarketData[]>;
  createContactMessage(message: InsertContactMessage): Promise<void>;
  
  // Seed methods
  createPersonalInfo(info: typeof personal_info.$inferInsert): Promise<PersonalInfo>;
  createExperience(exp: typeof experiences.$inferInsert): Promise<Experience>;
  createEducation(edu: typeof education.$inferInsert): Promise<Education>;
  createProject(proj: typeof projects.$inferInsert): Promise<Project>;
  createSkill(skill: typeof skills.$inferInsert): Promise<Skill>;
  createMarketData(data: typeof market_data.$inferInsert): Promise<MarketData>;
}

export class DatabaseStorage implements IStorage {
  async getPersonalInfo(): Promise<PersonalInfo | undefined> {
    const [info] = await db.select().from(personal_info).limit(1);
    return info;
  }

  async getExperiences(): Promise<Experience[]> {
    return await db.select().from(experiences);
  }

  async getEducation(): Promise<Education[]> {
    return await db.select().from(education);
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async getSkills(): Promise<Skill[]> {
    return await db.select().from(skills);
  }

  async getMarketData(): Promise<MarketData[]> {
    return await db.select().from(market_data);
  }

  async createContactMessage(message: InsertContactMessage): Promise<void> {
    await db.insert(contact_messages).values(message);
  }

  // Seed implementations
  async createPersonalInfo(info: typeof personal_info.$inferInsert): Promise<PersonalInfo> {
    const [newInfo] = await db.insert(personal_info).values(info).returning();
    return newInfo;
  }

  async createExperience(exp: typeof experiences.$inferInsert): Promise<Experience> {
    const [newExp] = await db.insert(experiences).values(exp).returning();
    return newExp;
  }

  async createEducation(edu: typeof education.$inferInsert): Promise<Education> {
    const [newEdu] = await db.insert(education).values(edu).returning();
    return newEdu;
  }

  async createProject(proj: typeof projects.$inferInsert): Promise<Project> {
    const [newProj] = await db.insert(projects).values(proj).returning();
    return newProj;
  }

  async createSkill(skill: typeof skills.$inferInsert): Promise<Skill> {
    const [newSkill] = await db.insert(skills).values(skill).returning();
    return newSkill;
  }

  async createMarketData(data: typeof market_data.$inferInsert): Promise<MarketData> {
    const [newData] = await db.insert(market_data).values(data).returning();
    return newData;
  }
}

export const storage = new DatabaseStorage();
