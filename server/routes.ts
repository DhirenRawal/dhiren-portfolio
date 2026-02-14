import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

async function seedDatabase() {
  const existingMarketData = await storage.getMarketData();
  if (existingMarketData.length === 0) {
    console.log("Seeding database...");
    
    // Personal Info (Check if exists)
    const existingInfo = await storage.getPersonalInfo();
    if (!existingInfo) {
      await storage.createPersonalInfo({
        name: "Dhiren Rawal",
        title: "Quantitative Finance Specialist",
        summary: "Master of Quantitative Finance candidate with strong expertise in derivatives, risk management, and market microstructure. Experienced in building automated trading simulations and data validation pipelines.",
        email: "dhiren.rawal2001@gmail.com",
        phone: "(858) 214-0637",
        linkedin: "linkedin.com/in/dhirenrawal9",
        location: "San Diego, California"
      });
    }

    // Experience (Check if exists)
    const existingExp = await storage.getExperiences();
    if (existingExp.length === 0) {
      await storage.createExperience({
        role: "Operations and Finance Manager",
        company: "Mahalaxmi Enterprises",
        location: "Thane, India",
        startDate: "11/2023",
        endDate: "08/2024",
        description: [
          "Improved liquidity forecasting accuracy by 10% by analyzing cash-flow patterns and variance shocks, enabling more reliable decisions under time pressure.",
          "Identified recurring error patterns in high-volume transactional data, implemented control checks and review workflows that reduced processing delays."
        ]
      });

      await storage.createExperience({
        role: "Investment Banking Intern",
        company: "StartupLanes",
        location: "Goa, India",
        startDate: "05/2023",
        endDate: "11/2023",
        description: [
          "Evaluated valuation sensitivity to key assumptions and downside scenarios by focusing on model instability under adverse conditions.",
          "Consolidated assumptions, sensitivities, and drivers into a unified model, increasing cross-team decision speed by 30%."
        ]
      });

      await storage.createExperience({
        role: "Operations Analyst",
        company: "Mahalaxmi Enterprises",
        location: "Thane, India",
        startDate: "06/2022",
        endDate: "05/2023",
        description: [
          "Increased delivery efficiency from 82% to 93% by segmenting products statistically that improved execution speed.",
          "Cut fulfillment cycle time from 18–25% by isolating high-impact inefficiencies in noisy operational data."
        ]
      });
    }

    // Education
    const existingEdu = await storage.getEducation();
    if (existingEdu.length === 0) {
      await storage.createEducation({
        degree: "Master of Quantitative Finance",
        institution: "Rady School of Management, UCSD",
        location: "San Diego, CA",
        graduationDate: "12/2025",
        courses: "Derivatives & Structured Products, Advanced Risk Management, Fixed Income, Econometrics"
      });

      await storage.createEducation({
        degree: "Bachelor of Commerce",
        institution: "KJ Somaiya College of Science and Commerce",
        location: "Mumbai, India",
        graduationDate: "04/2022",
        courses: "Financial Accounting, Business Economics, Cost Accounts, Management Accounts"
      });
    }

    // Projects
    const existingProj = await storage.getProjects();
    if (existingProj.length === 0) {
      await storage.createProject({
        title: "Real-Time Equity Options Volatility Surface Calibration & Monitoring",
        subtitle: "Independent Project",
        date: "09/2025",
        description: [
          "Built and monitored multi-maturity implied volatility surfaces with automated data validation, consistency checks, and failure diagnostics.",
          "Developed automated diagnostics to flag noisy or broken market inputs and stress-tested surfaces under spot, volatility, and earnings shocks."
        ],
        technologies: ["Python", "Data Analysis", "Volatility Modeling"]
      });

      await storage.createProject({
        title: "Market Making and Execution Simulation",
        subtitle: "Independent Project",
        date: "11/2025",
        description: [
          "Built a market-making simulator which models limit order book, execution-driven PnL, and inventory risk.",
          "Implemented inventory-aware bid/ask quoting with soft and hard risk limits.",
          "Identified and corrected a flawed execution model producing artificial zero-variance PnL."
        ],
        technologies: ["Python", "Simulation", "Market Microstructure"]
      });

      await storage.createProject({
        title: "Derivatives Pricing and Sensitivity Analysis",
        subtitle: "Independent Project",
        date: "12/2025",
        description: [
          "Designed and built a Python and SQL system simulating the full trade lifecycle from execution through settlement.",
          "Implemented automated reconciliation checks across front, middle, and back-office books to detect breaks and classify severity."
        ],
        technologies: ["Python", "SQL", "Risk Management"]
      });
    }

    // Skills
    const existingSkills = await storage.getSkills();
    if (existingSkills.length === 0) {
      await storage.createSkill({
        category: "Technical",
        items: ["Python", "SQL", "Advanced Excel", "Data Pipelines", "Automation"]
      });

      await storage.createSkill({
        category: "Financial",
        items: ["Derivatives", "Risk Management", "Time-Series Analysis", "Market Microstructure", "Econometrics"]
      });
    }

    // Market Data (Real Ticker Data)
    await storage.createMarketData({ symbol: "SPX", name: "S&P 500", price: "5026.61", change: "42.15", changePercent: "0.85", category: "Index" });
    await storage.createMarketData({ symbol: "AAPL", name: "Apple Inc.", price: "182.31", change: "-1.45", changePercent: "-0.79", category: "Stock" });
    await storage.createMarketData({ symbol: "GC=F", name: "Gold", price: "2013.40", change: "12.20", changePercent: "0.61", category: "Metal" });
    await storage.createMarketData({ symbol: "CL=F", name: "Crude Oil", price: "78.19", change: "0.95", changePercent: "1.23", category: "Future" });
    await storage.createMarketData({ symbol: "US10Y", name: "US 10Y Yield", price: "4.26", change: "0.04", changePercent: "0.95", category: "Rate" });
    
    console.log("Database seeded successfully");
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed database on startup
  seedDatabase().catch(console.error);

  app.get(api.profile.get.path, async (_req, res) => {
    const profile = await storage.getPersonalInfo();
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  });

  app.get(api.experience.list.path, async (_req, res) => {
    const experience = await storage.getExperiences();
    res.json(experience);
  });

  app.get(api.education.list.path, async (_req, res) => {
    const education = await storage.getEducation();
    res.json(education);
  });

  app.get(api.projects.list.path, async (_req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get(api.skills.list.path, async (_req, res) => {
    const skills = await storage.getSkills();
    res.json(skills);
  });

  app.get(api.market.list.path, async (_req, res) => {
    const data = await storage.getMarketData();
    res.json(data);
  });

  app.post(api.contact.submit.path, async (req, res) => {
    try {
      const input = api.contact.submit.input.parse(req.body);
      await storage.createContactMessage(input);
      res.status(201).json({ success: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ 
          message: err.errors[0].message,
          field: err.errors[0].path.join('.')
        });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
