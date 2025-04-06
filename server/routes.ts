import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage, type ListingFilters } from "./storage";
import { z } from "zod";
import { 
  insertContactMessageSchema,
  insertListingSchema
} from "@shared/schema";

const router = express.Router();

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);
  return httpServer;
}
