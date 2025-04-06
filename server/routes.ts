import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { MemStorage, type ListingFilters } from "./storage";
import { z } from "zod";
import { 
  insertContactMessageSchema,
  insertListingSchema,
  insertUserSchema
} from "@shared/schema";
import { setupAuth } from "./auth";

// Create storage instance
const storage = new MemStorage();

const router = express.Router();

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup auth
  setupAuth(app, storage);
  
  // API routes
  app.use("/api", router);
  
  // Get all cities
  router.get("/cities", async (req: Request, res: Response) => {
    const cities = await storage.getCities();
    res.json(cities);
  });
  
  // Get a specific city
  router.get("/cities/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid city ID" });
    }
    
    const city = await storage.getCityById(id);
    
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }
    
    res.json(city);
  });
  
  // Get all property types
  router.get("/property-types", async (req: Request, res: Response) => {
    const propertyTypes = await storage.getPropertyTypes();
    res.json(propertyTypes);
  });
  
  // Get a specific property type
  router.get("/property-types/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid property type ID" });
    }
    
    const propertyType = await storage.getPropertyTypeById(id);
    
    if (!propertyType) {
      return res.status(404).json({ message: "Property type not found" });
    }
    
    res.json(propertyType);
  });
  
  // Get listings with optional filters
  router.get("/listings", async (req: Request, res: Response) => {
    const filters: ListingFilters = {};
    
    // Parse filters from query params
    if (req.query.cityId) {
      filters.cityId = parseInt(req.query.cityId as string);
    }
    
    if (req.query.propertyTypeId) {
      filters.propertyTypeId = parseInt(req.query.propertyTypeId as string);
    }
    
    if (req.query.listingType) {
      filters.listingType = req.query.listingType as string;
    }
    
    if (req.query.minPrice) {
      filters.minPrice = parseInt(req.query.minPrice as string);
    }
    
    if (req.query.maxPrice) {
      filters.maxPrice = parseInt(req.query.maxPrice as string);
    }
    
    if (req.query.minSquareMeters) {
      filters.minSquareMeters = parseInt(req.query.minSquareMeters as string);
    }
    
    if (req.query.maxSquareMeters) {
      filters.maxSquareMeters = parseInt(req.query.maxSquareMeters as string);
    }
    
    if (req.query.roomCount) {
      filters.roomCount = parseInt(req.query.roomCount as string);
    }
    
    if (req.query.limit) {
      filters.limit = parseInt(req.query.limit as string);
    }
    
    if (req.query.search) {
      filters.search = req.query.search as string;
    }
    
    const listings = await storage.getListings(filters);
    res.json(listings);
  });
  
  // Get featured listings
  router.get("/featured-listings", async (req: Request, res: Response) => {
    let limit: number | undefined = undefined;
    
    if (req.query.limit) {
      limit = parseInt(req.query.limit as string);
    }
    
    const featuredListings = await storage.getFeaturedListings(limit);
    res.json(featuredListings);
  });
  
  // Get a specific listing
  router.get("/listings/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid listing ID" });
    }
    
    const listing = await storage.getListingById(id);
    
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    
    res.json(listing);
  });
  
  // Create a new listing
  router.post("/listings", async (req: Request, res: Response) => {
    try {
      const listingData = insertListingSchema.parse(req.body);
      const newListing = await storage.createListing(listingData);
      res.status(201).json(newListing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid listing data", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: "Failed to create listing" });
    }
  });
  
  // Submit a contact message
  router.post("/contact", async (req: Request, res: Response) => {
    try {
      const messageData = insertContactMessageSchema.parse(req.body);
      const newMessage = await storage.createContactMessage(messageData);
      res.status(201).json({ 
        success: true, 
        message: "Your message has been sent successfully", 
        id: newMessage.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid message data", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: "Failed to send message" });
    }
  });
  
  // Get users (protected, admin only)
  router.get("/users", (req: Request, res: Response) => {
    // Check if user is authenticated and is admin
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    
    // Get all users without sending password
    storage.getUsers().then(users => {
      const safeUsers = users.map(({ password, ...user }) => user);
      res.json({ success: true, users: safeUsers });
    });
  });
  
  // Get statistics (counts) for admin dashboard
  router.get("/admin/stats", (req: Request, res: Response) => {
    // Check if user is authenticated and is admin
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    
    Promise.all([
      storage.getUsers(),
      storage.getListings(),
      storage.getListings({ listingType: "sell" }),
      storage.getListings({ listingType: "rent" })
    ]).then(([users, allListings, sellListings, rentListings]) => {
      res.json({
        success: true,
        stats: {
          totalUsers: users.length,
          totalListings: allListings.length,
          sellListings: sellListings.length,
          rentListings: rentListings.length
        }
      });
    }).catch(err => {
      res.status(500).json({ message: "Failed to fetch statistics" });
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
