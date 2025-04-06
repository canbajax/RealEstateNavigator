import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { MemStorage, type ListingFilters } from "./storage";
import { z } from "zod";
import { 
  insertContactMessageSchema,
  insertListingSchema,
  insertUserSchema,
  contactInfoSchema,
  workingHoursSchema,
  Listing
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
    // Get property types and listings
    const propertyTypes = await storage.getPropertyTypes();
    const listings = await storage.getListings();
    
    // Calculate actual listing counts for each property type
    const updatedPropertyTypes = propertyTypes.map(propertyType => {
      // Count listings for this property type
      const count = listings.filter(listing => listing.propertyTypeId === propertyType.id).length;
      
      // Return updated property type with correct listing count
      return {
        ...propertyType,
        listingCount: count
      };
    });
    
    res.json(updatedPropertyTypes);
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
    
    // Count listings for this property type
    const listings = await storage.getListings({ propertyTypeId: id });
    
    // Return property type with accurate listing count
    res.json({
      ...propertyType,
      listingCount: listings.length
    });
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
  
  // Get all agents/consultants (public endpoint)
  router.get("/agents", (req: Request, res: Response) => {
    storage.getUsers().then(users => {
      // Filter only agents and exclude admin
      const agents = users
        .filter(user => user.role === "agent")
        .map(({ password, ...agent }) => agent);
      
      res.json({ success: true, agents });
    }).catch(err => {
      res.status(500).json({ message: "Failed to fetch agents" });
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
  
  // Update listing (admin only)
  router.put("/listings/:id", async (req: Request, res: Response) => {
    // Check if user is authenticated and is admin
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid listing ID" });
    }
    
    try {
      // Validate request body
      const listing = await storage.getListingById(id);
      
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      const updateData = insertListingSchema.partial().parse(req.body);
      
      // Update listing in storage
      const updatedListing = await storage.updateListing(id, updateData);
      
      res.json({ 
        success: true, 
        message: "Listing updated successfully",
        listing: updatedListing
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid listing data", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: "Failed to update listing" });
    }
  });
  
  // Delete listing (admin only)
  router.delete("/listings/:id", async (req: Request, res: Response) => {
    // Check if user is authenticated and is admin
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid listing ID" });
    }
    
    try {
      const success = await storage.deleteListing(id);
      
      if (!success) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      res.json({ 
        success: true, 
        message: "Listing deleted successfully" 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete listing" });
    }
  });
  
  // Create new user (admin only)
  router.post("/users", async (req: Request, res: Response) => {
    // Check if user is authenticated and is admin
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const newUser = await storage.createUser(userData);
      
      // Don't send password back
      const { password, ...safeUser } = newUser;
      
      res.status(201).json({ 
        success: true, 
        message: "User created successfully",
        user: safeUser 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid user data", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  // Update user (admin only)
  router.put("/users/:id", async (req: Request, res: Response) => {
    // Check if user is authenticated and is admin
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    try {
      // Validate request body
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updateData = insertUserSchema.partial().parse(req.body);
      
      // Update user in storage
      const updatedUser = await storage.updateUser(id, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't send password back
      const { password, ...safeUser } = updatedUser;
      
      res.json({ 
        success: true, 
        message: "User updated successfully",
        user: safeUser
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid user data", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  
  // Delete user (admin only)
  router.delete("/users/:id", async (req: Request, res: Response) => {
    // Check if user is authenticated and is admin
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    // Don't allow deleting the admin user
    const user = await storage.getUser(id);
    if (user?.role === "admin") {
      return res.status(403).json({ message: "Cannot delete admin user" });
    }
    
    try {
      const success = await storage.deleteUser(id);
      
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ 
        success: true, 
        message: "User deleted successfully" 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });
  
  // Site settings API endpoints
  
  // Get contact info
  router.get("/site-settings/contact-info", async (req: Request, res: Response) => {
    try {
      const contactInfo = await storage.getContactInfo();
      res.json({ success: true, contactInfo });
    } catch (error) {
      res.status(500).json({ message: "Failed to get contact information" });
    }
  });
  
  // Update contact info (admin only)
  router.post("/site-settings/contact-info", async (req: Request, res: Response) => {
    // Check if user is authenticated and is admin
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    
    try {
      const contactInfoData = contactInfoSchema.parse(req.body);
      const updated = await storage.updateContactInfo(contactInfoData);
      res.json({ 
        success: true, 
        message: "Contact information updated successfully",
        contactInfo: updated.value
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid contact information", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: "Failed to update contact information" });
    }
  });
  
  // Get working hours
  router.get("/site-settings/working-hours", async (req: Request, res: Response) => {
    try {
      const workingHours = await storage.getWorkingHours();
      res.json({ success: true, workingHours });
    } catch (error) {
      res.status(500).json({ message: "Failed to get working hours" });
    }
  });
  
  // Update working hours (admin only)
  router.post("/site-settings/working-hours", async (req: Request, res: Response) => {
    // Check if user is authenticated and is admin
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    
    try {
      const workingHoursData = workingHoursSchema.parse(req.body);
      const updated = await storage.updateWorkingHours(workingHoursData);
      res.json({ 
        success: true, 
        message: "Working hours updated successfully",
        workingHours: updated.value
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid working hours data", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: "Failed to update working hours" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
