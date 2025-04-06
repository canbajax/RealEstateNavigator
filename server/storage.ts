import {
  users, type User, type InsertUser,
  cities, type City, type InsertCity,
  propertyTypes, type PropertyType, type InsertPropertyType,
  listings, type Listing, type InsertListing,
  contactMessages, type ContactMessage, type InsertContactMessage
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // City operations
  getCities(): Promise<City[]>;
  getCityById(id: number): Promise<City | undefined>;
  createCity(city: InsertCity): Promise<City>;
  
  // Property Type operations
  getPropertyTypes(): Promise<PropertyType[]>;
  getPropertyTypeById(id: number): Promise<PropertyType | undefined>;
  createPropertyType(propertyType: InsertPropertyType): Promise<PropertyType>;
  
  // Listing operations
  getListings(filters?: ListingFilters): Promise<Listing[]>;
  getListingById(id: number): Promise<Listing | undefined>;
  getFeaturedListings(limit?: number): Promise<Listing[]>;
  createListing(listing: InsertListing): Promise<Listing>;
  
  // Contact Message operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
}

export interface ListingFilters {
  cityId?: number;
  propertyTypeId?: number;
  listingType?: string;
  minPrice?: number;
  maxPrice?: number;
  minSquareMeters?: number;
  maxSquareMeters?: number;
  roomCount?: number;
  limit?: number;
  search?: string;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cities: Map<number, City>;
  private propertyTypes: Map<number, PropertyType>;
  private listings: Map<number, Listing>;
  private contactMessages: Map<number, ContactMessage>;
  
  private userCurrentId: number;
  private cityCurrentId: number;
  private propertyTypeCurrentId: number;
  private listingCurrentId: number;
  private contactMessageCurrentId: number;

  constructor() {
    this.users = new Map();
    this.cities = new Map();
    this.propertyTypes = new Map();
    this.listings = new Map();
    this.contactMessages = new Map();
    
    this.userCurrentId = 1;
    this.cityCurrentId = 1;
    this.propertyTypeCurrentId = 1;
    this.listingCurrentId = 1;
    this.contactMessageCurrentId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // City operations
  async getCities(): Promise<City[]> {
    return Array.from(this.cities.values());
  }
  
  async getCityById(id: number): Promise<City | undefined> {
    return this.cities.get(id);
  }
  
  async createCity(insertCity: InsertCity): Promise<City> {
    const id = this.cityCurrentId++;
    const city: City = { ...insertCity, id };
    this.cities.set(id, city);
    return city;
  }
  
  // Property Type operations
  async getPropertyTypes(): Promise<PropertyType[]> {
    return Array.from(this.propertyTypes.values());
  }
  
  async getPropertyTypeById(id: number): Promise<PropertyType | undefined> {
    return this.propertyTypes.get(id);
  }
  
  async createPropertyType(insertPropertyType: InsertPropertyType): Promise<PropertyType> {
    const id = this.propertyTypeCurrentId++;
    const propertyType: PropertyType = { ...insertPropertyType, id };
    this.propertyTypes.set(id, propertyType);
    return propertyType;
  }
  
  // Listing operations
  async getListings(filters?: ListingFilters): Promise<Listing[]> {
    let listings = Array.from(this.listings.values());
    
    if (filters) {
      if (filters.cityId !== undefined) {
        listings = listings.filter(listing => listing.cityId === filters.cityId);
      }
      
      if (filters.propertyTypeId !== undefined) {
        listings = listings.filter(listing => listing.propertyTypeId === filters.propertyTypeId);
      }
      
      if (filters.listingType !== undefined) {
        listings = listings.filter(listing => listing.listingType === filters.listingType);
      }
      
      if (filters.minPrice !== undefined) {
        listings = listings.filter(listing => listing.price >= filters.minPrice!);
      }
      
      if (filters.maxPrice !== undefined) {
        listings = listings.filter(listing => listing.price <= filters.maxPrice!);
      }
      
      if (filters.minSquareMeters !== undefined) {
        listings = listings.filter(listing => listing.squareMeters >= filters.minSquareMeters!);
      }
      
      if (filters.maxSquareMeters !== undefined) {
        listings = listings.filter(listing => listing.squareMeters <= filters.maxSquareMeters!);
      }
      
      if (filters.roomCount !== undefined) {
        listings = listings.filter(listing => listing.roomCount === filters.roomCount);
      }
      
      if (filters.search !== undefined) {
        const searchLower = filters.search.toLowerCase();
        listings = listings.filter(listing => 
          listing.title.toLowerCase().includes(searchLower) || 
          listing.description.toLowerCase().includes(searchLower) ||
          listing.district.toLowerCase().includes(searchLower) ||
          listing.address.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters.limit !== undefined) {
        listings = listings.slice(0, filters.limit);
      }
    }
    
    // Sort by postedAt in descending order (newest first)
    return listings.sort((a, b) => {
      return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    });
  }
  
  async getListingById(id: number): Promise<Listing | undefined> {
    return this.listings.get(id);
  }
  
  async getFeaturedListings(limit: number = 4): Promise<Listing[]> {
    const featuredListings = Array.from(this.listings.values())
      .filter(listing => listing.isFeatured)
      .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
    
    return featuredListings.slice(0, limit);
  }
  
  async createListing(insertListing: InsertListing): Promise<Listing> {
    const id = this.listingCurrentId++;
    const now = new Date();
    const listing: Listing = { 
      ...insertListing, 
      id, 
      postedAt: now 
    };
    this.listings.set(id, listing);
    return listing;
  }
  
  // Contact Message operations
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.contactMessageCurrentId++;
    const now = new Date();
    const message: ContactMessage = { 
      ...insertMessage, 
      id, 
      createdAt: now 
    };
    this.contactMessages.set(id, message);
    return message;
  }
  
  // Initialize with sample data
  private initializeData() {
    // Create a sample user
    const sampleUser: InsertUser = {
      username: "emlakagent",
      password: "password123",
      fullName: "Ahmet Yılmaz",
      email: "ahmet@emlakcompass.com",
      phone: "+90 (212) 123 45 67",
      avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg"
    };
    const user = this.createUser(sampleUser);
    
    // Create sample cities
    const citiesData: InsertCity[] = [
      { name: "İstanbul", imageUrl: "https://images.unsplash.com/photo-1610116306796-6fea9f4fae38", listingCount: 3245 },
      { name: "Ankara", imageUrl: "https://images.unsplash.com/photo-1589497836818-9ad2fa1df1f4", listingCount: 1876 },
      { name: "İzmir", imageUrl: "https://images.unsplash.com/photo-1619360142632-031d811d1f50", listingCount: 1325 },
      { name: "Antalya", imageUrl: "https://images.unsplash.com/photo-1661416134766-cd0386c4b650", listingCount: 953 },
      { name: "Bursa", imageUrl: "https://images.unsplash.com/photo-1621164918541-56fac1c2a814", listingCount: 716 }
    ];
    
    citiesData.forEach(city => this.createCity(city));
    
    // Create sample property types
    const propertyTypesData: InsertPropertyType[] = [
      { name: "Daire", icon: "building", listingCount: 1240 },
      { name: "Villa", icon: "home", listingCount: 485 },
      { name: "İş Yeri", icon: "store", listingCount: 320 },
      { name: "Arsa", icon: "map", listingCount: 218 },
      { name: "Yazlık", icon: "hotel", listingCount: 176 },
      { name: "Depo", icon: "warehouse", listingCount: 92 }
    ];
    
    propertyTypesData.forEach(type => this.createPropertyType(type));
    
    // Create sample listings
    const listingsData: InsertListing[] = [
      {
        title: "Modern Villa - Deniz Manzaralı",
        description: "Beşiktaş'ta benzersiz deniz manzarasına sahip modern tasarımlı lüks villa. Geniş bahçe, özel yüzme havuzu ve güvenlikli site içerisinde. İstanbul Boğazı'nın muhteşem manzarasına sahip bu villa, lüks ve konforu bir arada sunuyor.",
        price: 12500000,
        listingType: "sell",
        rentPeriod: null,
        propertyTypeId: 2, // Villa
        cityId: 1, // İstanbul
        district: "Beşiktaş",
        address: "Etiler Mah. Nispetiye Cad. No:42",
        squareMeters: 320,
        roomCount: 4,
        bathroomCount: 3,
        parkingCount: 2,
        isFeatured: true,
        userId: 1,
        imageUrls: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c"],
        latitude: 41.0825,
        longitude: 29.0340
      },
      {
        title: "Lüks Rezidans Dairesi",
        description: "Kadıköy'ün merkezinde, deniz manzaralı, lüks rezidans dairesi. 7/24 güvenlik, kapalı otopark, fitness center, havuz ve concierge hizmetleri mevcut. Metro ve Marmaray'a yürüme mesafesinde.",
        price: 25000,
        listingType: "rent",
        rentPeriod: "monthly",
        propertyTypeId: 1, // Daire
        cityId: 1, // İstanbul
        district: "Kadıköy",
        address: "Caddebostan Mah. Bağdat Cad. No:112",
        squareMeters: 160,
        roomCount: 3,
        bathroomCount: 2,
        parkingCount: 1,
        isFeatured: true,
        userId: 1,
        imageUrls: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"],
        latitude: 40.9833,
        longitude: 29.0631
      },
      {
        title: "Modern Ofis Katı",
        description: "Levent'te A+ ofis binasında, şık dekore edilmiş, her türlü altyapıya sahip prestijli ofis katı. Akıllı bina sistemi, teknik altyapı, konferans salonu, resepsiyon hizmetleri mevcut. Metro istasyonuna 5 dakika yürüme mesafesinde.",
        price: 4750000,
        listingType: "sell",
        rentPeriod: null,
        propertyTypeId: 3, // İş Yeri
        cityId: 1, // İstanbul
        district: "Levent",
        address: "Levent Mah. Büyükdere Cad. No:185",
        squareMeters: 250,
        roomCount: 5,
        bathroomCount: 2,
        parkingCount: 3,
        isFeatured: true,
        userId: 1,
        imageUrls: ["https://images.unsplash.com/photo-1613977257363-707ba9348227"],
        latitude: 41.0843,
        longitude: 29.0131
      },
      {
        title: "Bahçeli Müstakil Ev",
        description: "Ümraniye'de 500m² arsa içerisinde konumlanmış, 220m² kullanım alanlı, bahçeli müstakil ev. 4+1 oda düzenine sahip, doğalgaz kombili, geniş teraslı ve bakımlı bahçeli. Okul ve alışveriş merkezine yakın mesafede.",
        price: 6980000,
        listingType: "sell",
        rentPeriod: null,
        propertyTypeId: 2, // Villa
        cityId: 1, // İstanbul
        district: "Ümraniye",
        address: "Atakent Mah. Çiçek Sok. No:56",
        squareMeters: 220,
        roomCount: 5,
        bathroomCount: 3,
        parkingCount: 2,
        isFeatured: true,
        userId: 1,
        imageUrls: ["https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f"],
        latitude: 41.0264,
        longitude: 29.0962
      }
    ];
    
    listingsData.forEach(listing => this.createListing(listing));
  }
}

export const storage = new MemStorage();
