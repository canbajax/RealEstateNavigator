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
  getUsers(): Promise<User[]>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
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

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    // Ensure phone and avatarUrl are not undefined
    const userWithDefaults = {
      ...insertUser,
      phone: insertUser.phone || null,
      avatarUrl: insertUser.avatarUrl || null,
      role: insertUser.role || "agent",
      createdAt: now
    };
    const user: User = { ...userWithDefaults, id };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      ...userData,
      phone: userData.phone !== undefined ? userData.phone : user.phone,
      avatarUrl: userData.avatarUrl !== undefined ? userData.avatarUrl : user.avatarUrl,
      role: userData.role || user.role
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async deleteUser(id: number): Promise<boolean> {
    if (!this.users.has(id)) {
      return false;
    }
    return this.users.delete(id);
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
    // Ensure listingCount is not undefined
    const cityWithDefaults = {
      ...insertCity,
      listingCount: insertCity.listingCount ?? 0
    };
    const city: City = { ...cityWithDefaults, id };
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
    // Ensure listingCount is not undefined
    const propertyTypeWithDefaults = {
      ...insertPropertyType,
      listingCount: insertPropertyType.listingCount ?? 0
    };
    const propertyType: PropertyType = { ...propertyTypeWithDefaults, id };
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
    
    // Ensure optional fields have appropriate default values
    const listingWithDefaults = {
      ...insertListing,
      roomCount: insertListing.roomCount ?? null,
      bathroomCount: insertListing.bathroomCount ?? null,
      parkingCount: insertListing.parkingCount ?? null,
      rentPeriod: insertListing.rentPeriod ?? null,
      isFeatured: insertListing.isFeatured ?? false,
      latitude: insertListing.latitude ?? null,
      longitude: insertListing.longitude ?? null
    };
    
    const listing: Listing = { 
      ...listingWithDefaults, 
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
    // Create sample cities
    const citiesData: InsertCity[] = [
      { 
        name: "İstanbul", 
        imageUrl: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80", 
        listingCount: 67 
      },
      { 
        name: "Ankara", 
        imageUrl: "https://images.unsplash.com/photo-1609783232088-f1681a6f1b4d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80", 
        listingCount: 48 
      },
      { 
        name: "İzmir", 
        imageUrl: "https://images.unsplash.com/photo-1617391258031-f8d80b22fb58?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80", 
        listingCount: 36 
      },
      { 
        name: "Antalya", 
        imageUrl: "https://images.unsplash.com/photo-1605537964075-3df587920e9b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80", 
        listingCount: 29 
      },
      { 
        name: "Bursa", 
        imageUrl: "https://images.unsplash.com/photo-1614436981601-5ce6396ce101?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80", 
        listingCount: 20 
      },
      {
        name: "Muğla",
        imageUrl: "https://images.unsplash.com/photo-1559131903-e27ffd952c2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
        listingCount: 15
      },
      {
        name: "Eskişehir",
        imageUrl: "https://images.unsplash.com/photo-1589912187107-3ab407f13e74?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
        listingCount: 12
      },
      {
        name: "Aydın",
        imageUrl: "https://images.unsplash.com/photo-1591146590908-9cd0cb6e6ec6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
        listingCount: 9
      },
      {
        name: "Trabzon",
        imageUrl: "https://images.unsplash.com/photo-1593238750802-7c9be9c0aad0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
        listingCount: 7
      },
      {
        name: "Konya",
        imageUrl: "https://images.unsplash.com/photo-1568322951949-12a4b65fad82?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
        listingCount: 5
      }
    ];

    // Create property types
    const propertyTypesData: InsertPropertyType[] = [
      { name: "Daire", icon: "home", listingCount: 0 },
      { name: "Villa", icon: "building", listingCount: 0 },
      { name: "İş Yeri", icon: "briefcase", listingCount: 0 },
      { name: "Arsa", icon: "map", listingCount: 0 },
      { name: "Yazlık", icon: "sun", listingCount: 0 },
      { name: "Depo", icon: "box", listingCount: 0 },
    ];

    // Create cities
    citiesData.forEach(city => this.createCity(city));
    
    // Create property types
    propertyTypesData.forEach(propertyType => this.createPropertyType(propertyType));

    // Create 20 real estate agents (users)
    const maleFirstNames = ["Ahmet", "Mehmet", "Mustafa", "Ali", "Hüseyin", "İbrahim", "Hasan", "Osman", "Ömer", "Serkan", "Murat", "Cengiz", "Serdar", "Fatih", "Emre"];
    const femaleFirstNames = ["Ayşe", "Fatma", "Zeynep", "Elif", "Emine", "Hatice", "Merve", "Özge", "Gül", "Sevgi", "Sevim", "Canan", "Ece", "Deniz", "Selin"];
    const lastNames = ["Yılmaz", "Kaya", "Demir", "Çelik", "Şahin", "Yıldız", "Çetin", "Aydın", "Özdemir", "Arslan", "Doğan", "Kılıç", "Aslan", "Çevik", "Koç", "Kurt", "Korkmaz", "Öztürk", "Acar", "Yücel"];
    
    const maleAvatars = [
      "https://randomuser.me/api/portraits/men/1.jpg",
      "https://randomuser.me/api/portraits/men/2.jpg",
      "https://randomuser.me/api/portraits/men/3.jpg",
      "https://randomuser.me/api/portraits/men/4.jpg",
      "https://randomuser.me/api/portraits/men/5.jpg",
      "https://randomuser.me/api/portraits/men/6.jpg",
      "https://randomuser.me/api/portraits/men/7.jpg",
      "https://randomuser.me/api/portraits/men/8.jpg",
      "https://randomuser.me/api/portraits/men/9.jpg",
      "https://randomuser.me/api/portraits/men/10.jpg"
    ];
    
    const femaleAvatars = [
      "https://randomuser.me/api/portraits/women/1.jpg",
      "https://randomuser.me/api/portraits/women/2.jpg",
      "https://randomuser.me/api/portraits/women/3.jpg",
      "https://randomuser.me/api/portraits/women/4.jpg",
      "https://randomuser.me/api/portraits/women/5.jpg",
      "https://randomuser.me/api/portraits/women/6.jpg",
      "https://randomuser.me/api/portraits/women/7.jpg",
      "https://randomuser.me/api/portraits/women/8.jpg",
      "https://randomuser.me/api/portraits/women/9.jpg",
      "https://randomuser.me/api/portraits/women/10.jpg"
    ];

    // Generate 20 real estate agents and 1 admin
    const usersData: InsertUser[] = [];
    
    // Add admin user
    usersData.push({
      username: "admin",
      password: "admin123", // Demo password, would be hashed in production
      fullName: "Admin User",
      email: "admin@emlakcompass.com",
      phone: "+905551234567",
      avatarUrl: "https://randomuser.me/api/portraits/men/0.jpg",
      role: "admin"
    });
    
    // Add 12 male agents
    for (let i = 0; i < 12; i++) {
      const firstName = maleFirstNames[i % maleFirstNames.length];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${firstName} ${lastName}`;
      const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}`;
      const email = `${username}@emlakcompass.com`;
      const phone = `+90${Math.floor(5000000000 + Math.random() * 9000000000)}`;
      const avatarUrl = maleAvatars[i % maleAvatars.length];
      
      usersData.push({
        username,
        password: "emlak123", // Demo password, would be hashed in production
        fullName,
        email,
        phone,
        avatarUrl,
        role: "agent"
      });
    }
    
    // Add 8 female agents
    for (let i = 0; i < 8; i++) {
      const firstName = femaleFirstNames[i % femaleFirstNames.length];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${firstName} ${lastName}`;
      const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}`;
      const email = `${username}@emlakcompass.com`;
      const phone = `+90${Math.floor(5000000000 + Math.random() * 9000000000)}`;
      const avatarUrl = femaleAvatars[i % femaleAvatars.length];
      
      usersData.push({
        username,
        password: "emlak123", // Demo password, would be hashed in production
        fullName,
        email,
        phone,
        avatarUrl,
        role: "agent"
      });
    }
    
    // Create users
    usersData.forEach(user => this.createUser(user));

    // Helper functions for generating property data
    const getRandomPastDate = (daysMax = 90) => {
      const today = new Date();
      const daysAgo = Math.floor(Math.random() * daysMax) + 1;
      const pastDate = new Date(today);
      pastDate.setDate(today.getDate() - daysAgo);
      return pastDate;
    };
    
    const randomFloat = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };
    
    const randomInt = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Base coordinates for cities (approximate centers)
    const cityCoordinates = {
      1: { lat: 41.0082, lng: 28.9784 }, // İstanbul
      2: { lat: 39.9334, lng: 32.8597 }, // Ankara
      3: { lat: 38.4192, lng: 27.1287 }, // İzmir
      4: { lat: 36.8969, lng: 30.7133 }, // Antalya
      5: { lat: 40.1885, lng: 29.0610 }, // Bursa
      6: { lat: 37.2154, lng: 28.3634 }, // Muğla
      7: { lat: 39.7667, lng: 30.5256 }, // Eskişehir
      8: { lat: 37.8560, lng: 27.8416 }, // Aydın
      9: { lat: 41.0053, lng: 39.7167 }, // Trabzon
      10: { lat: 37.8715, lng: 32.4846 }  // Konya
    };

    // Helper function to create property descriptions
    const getPropertyDescription = (propertyTypeId: number, listingType: string, rooms?: number) => {
      const descriptions: Record<number, string[]> = {
        1: [ // Daire
          `Modern mimarisi ile dikkat çeken ${rooms} odalı daire. Ferah ve aydınlık iç mekanlar, kaliteli malzemeler ve akıllı ev sistemleri ile donatılmıştır. Ankastre mutfak, yerden ısıtma ve geniş balkon mevcuttur. Site içerisinde havuz, fitness salonu ve çocuk oyun alanı bulunmaktadır.`,
          `Şehir merkezinde, ulaşım imkanlarına yakın konumda ${rooms} odalı daire. Yeni binada, yüksek tavanlı, güney cepheli ve ışık alan daire. Ankastre mutfak, ısı yalıtımı ve deprem yönetmeliğine uygun inşa edilmiştir.`,
          `Güvenlikli site içerisinde ${rooms} odalı daire. Açık mutfak, geniş salon ve ferah odaları ile konforlu bir yaşam sunmaktadır. Site içerisinde otopark, çocuk oyun alanı ve 7/24 güvenlik bulunmaktadır.`,
          `Metrobüs durağına 5 dakika yürüme mesafesinde, ${rooms} odalı daire. Yeni binanın ${randomInt(2, 8)}. katında yer alan daire, güney-doğu cepheli olup bol ışık almaktadır. Doğalgaz kombi, laminant parke zemin ve PVC doğrama mevcuttur.`,
          `Deniz manzaralı, ${rooms} odalı daire. Yenilenmiş mutfak ve banyosu ile kullanıma hazır. Kapı ve pencereler ısı yalıtımlı olup, ses izolasyonu yapılmıştır. Ayrıca binanın dış cephesi mantolama ile kaplıdır.`
        ],
        2: [ // Villa
          `Özel havuzlu, bahçeli lüks villa. ${rooms} oda, ${Math.ceil(rooms ? rooms/2 : 1)} banyo, geniş salon ve mutfak ile konforlu bir yaşam sunmaktadır. Bahçesinde barbekü alanı, kamelyalar ve otomatik sulama sistemi mevcuttur.`,
          `Deniz manzaralı, müstakil bahçeli villa. ${rooms} yatak odası, ${Math.ceil(rooms ? rooms/2 : 1)} banyo, çift salon ve amerikan mutfak ile ferah bir yaşam alanı. Akıllı ev sistemleri, yerden ısıtma ve güneş enerjisi sistemleri bulunmaktadır.`,
          `Modern mimarisi ile dikkat çeken ${rooms} odalı villa. Açık havuz, jakuzi ve sauna ile lüks bir yaşam vaat ediyor. Geniş bahçesi içerisinde otopark ve güvenlik sistemi mevcuttur.`,
          `Göl manzaralı, doğa ile iç içe ${rooms} odalı villa. Şömineli salon, geniş teras ve özel bahçesi ile huzurlu bir yaşam sunmaktadır. Güneş enerjisi, jeneratör ve su deposu ile tam donanımlıdır.`,
          `Lüks site içerisinde ${rooms} odalı villa. Özel yüzme havuzu, bahçe ve terasları ile konforlu bir yaşam alanı. Site içerisinde tenis kortu, basketbol sahası ve yürüyüş parkuru bulunmaktadır.`
        ],
        3: [ // İş Yeri
          `İşlek cadde üzerinde, yüksek vitrinli dükkan. WC ve depo alanı mevcut olup, her türlü ticari faaliyet için uygundur. İş yeri devir ücreti yoktur.`,
          `Yeni plazada, modern ofis katı. Açık ofis düzeni, toplantı odası ve mutfak alanı mevcuttur. 7/24 güvenlik, kapalı otopark ve yüksek hızlı internet altyapısı ile donatılmıştır.`,
          `AVM içerisinde mağaza. İnsan sirkülasyonu yüksek konumda, her türlü ticari faaliyet için uygundur. Klima, güvenlik ve yangın sistemleri mevcuttur.`,
          `Sanayi bölgesinde üretim ve depolama alanı. Yüksek tavan, geniş kapı ve rampa ile lojistik açıdan avantajlı. Ofis alanı, yemekhane ve güvenlik mevcuttur.`,
          `Merkezi konumda, cadde üzerinde restoran/kafe. Mutfak donanımı, bar ve oturma grupları ile devren satılıktır. Arka bahçesi ve teraslı alan mevcuttur.`
        ],
        4: [ // Arsa
          `Deniz manzaralı, imarlı konut arsası. Elektrik, su ve doğalgaz altyapısı hazır. Yol cepheli ve köşe parsel olup, inşaata hazır durumdadır.`,
          `Tarla vasfında, yatırımlık arsa. İmara açılması beklenen bölgede, ana yola yakın konumda. Sulama kuyusu ve elektrik hattı mevcuttur.`,
          `Sanayi imarlı ticari arsa. Organize sanayi bölgesinde, ana cadde üzerinde. Altyapısı tamamlanmış, ruhsata hazır durumdadır.`,
          `Göl manzaralı, müstakil ev imarlı arsa. %20 inşaat izni ile 2 katlı yapı yapılabilir. Elektrik ve su altyapısı mevcuttur.`,
          `Turizm imarlı arsa. Denize yakın konumda, otel veya tatil köyü yapımına uygundur. %40 inşaat izni ile geniş yapılaşma hakkına sahiptir.`
        ],
        5: [ // Yazlık
          `Denize sıfır konumda, site içerisinde ${rooms} odalı yazlık. Özel plajı, havuzu ve sosyal tesisleri ile yaz tatiliniz için ideal. Eşyalı olarak teslim edilecektir.`,
          `Deniz manzaralı, müstakil bahçeli yazlık. ${rooms} oda, ${Math.ceil(rooms ? rooms/2 : 1)} banyo ve geniş terası ile konforlu bir tatil imkanı sunmaktadır. Bahçesinde barbekü ve oturma grupları mevcuttur.`,
          `Site içerisinde ${rooms} odalı yazlık. Ortak havuz, tenis kortu ve çocuk oyun alanı kullanımı. Denize yürüme mesafesinde olup, merkeze yakın konumdadır.`,
          `Göl kenarında, doğa ile iç içe ${rooms} odalı yazlık. Özel iskelesi, bahçesi ve manzarası ile huzurlu bir tatil imkanı. Tam donanımlı mutfak ve klimalar mevcuttur.`,
          `Dağ manzaralı, ${rooms} oda banyolu yazlık. Bahçesi, havuzu ve barbekü alanı ile ailenizle keyifli vakit geçirebileceğiniz bir tatil evi. Doğa yürüyüşleri için ideal bir konumda yer almaktadır.`
        ],
        6: [ // Depo
          `Sanayi bölgesinde, 7 metre tavan yüksekliğine sahip depo. Tır ve kamyon yanaşma rampası, geniş manevra alanı ve güvenlik sistemi mevcuttur.`,
          `Lojistik firma ve üreticiler için uygun, modern depo. Yüksek tavan, geniş kapılar ve ofis alanı ile kullanışlı bir çalışma ortamı sunmaktadır.`,
          `Organize sanayi bölgesinde, betonarme depo. Yangın söndürme sistemi, güvenlik kameraları ve alarm sistemleri ile donatılmıştır.`,
          `Ana yol üzerinde, lojistik depo. Büyük araç giriş kapısı, yükleme-indirme platformu ve forklift geçişine uygun geniş koridorlar mevcuttur.`,
          `Soğuk hava deposu. -18 dereceye kadar soğutma kapasitesi, hijyenik ortam ve özel izolasyon sistemleri ile gıda saklamaya uygundur.`
        ]
      };
      
      // Get random description based on property type
      const typeDescriptions = descriptions[propertyTypeId];
      const baseDescription = typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
      
      // Add listing type specific details
      let additionalDetails = "";
      
      if (listingType === "sell") {
        additionalDetails = " Kredi kullanımına uygundur. Tapu devrinde kolaylık sağlanacaktır. ";
      } else if (listingType === "rent") {
        additionalDetails = " Uzun süreli kiralama için uygundur. Depozito bedeli 2 aylık kira tutarındadır. ";
      } else if (listingType === "daily") {
        additionalDetails = " Günlük, haftalık kiralama için uygundur. Minimum 3 gün kiralama yapılmaktadır. ";
      }
      
      return baseDescription + additionalDetails;
    };

    // Common image URLs for property types
    const propertyImages: Record<number, string[]> = {
      1: [ // Daire
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        "https://images.unsplash.com/photo-1630699144867-37acfcb89f25?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        "https://images.unsplash.com/photo-1610527003928-47adb6ad1721?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      ],
      2: [ // Villa
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        "https://images.unsplash.com/photo-1616137466211-f939a420be84?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80",
        "https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      ],
      3: [ // İş Yeri
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        "https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80",
        "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
      ],
      4: [ // Arsa
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80",
        "https://images.unsplash.com/photo-1591474200742-8e512e6f98f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
        "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      ],
      5: [ // Yazlık
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80",
        "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        "https://images.unsplash.com/photo-1576941089067-2de3c901e126?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80",
        "https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      ],
      6: [ // Depo
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        "https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        "https://images.unsplash.com/photo-1523828223637-a8d3e394bb6e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      ]
    };
    
    // Property title prefixes based on property type and listing type
    const propertyTitles: Record<string, Record<number, string[]>> = {
      sell: {
        1: ["Satılık Lüks Daire", "Satılık Modern Daire", "Satılık Yeni Daire", "Satılık Ferah Daire", "Satılık Aydınlık Daire", "Satılık Deniz Manzaralı Daire"],
        2: ["Satılık Lüks Villa", "Satılık Modern Villa", "Satılık Havuzlu Villa", "Satılık Bahçeli Villa", "Satılık Deniz Manzaralı Villa", "Satılık Müstakil Villa"],
        3: ["Satılık İş Yeri", "Satılık Dükkan", "Satılık Ofis", "Satılık Mağaza", "Satılık Plaza Katı", "Satılık Ticari Alan"],
        4: ["Satılık Arsa", "Satılık İmarlı Arsa", "Satılık Yatırımlık Arsa", "Satılık Deniz Manzaralı Arsa", "Satılık Ticari Arsa", "Satılık Konut Arsası"],
        5: ["Satılık Yazlık", "Satılık Denize Yakın Yazlık", "Satılık Site İçi Yazlık", "Satılık Müstakil Yazlık", "Satılık Deniz Manzaralı Yazlık", "Satılık Eşyalı Yazlık"],
        6: ["Satılık Depo", "Satılık Lojistik Depo", "Satılık Antrepo", "Satılık Sanayi Deposu", "Satılık Soğuk Hava Deposu", "Satılık Ticari Depo"]
      },
      rent: {
        1: ["Kiralık Daire", "Kiralık Lüks Daire", "Kiralık Eşyalı Daire", "Kiralık Residence", "Kiralık Stüdyo Daire", "Kiralık Bahçe Katı"],
        2: ["Kiralık Villa", "Kiralık Lüks Villa", "Kiralık Havuzlu Villa", "Kiralık Bahçeli Villa", "Kiralık Eşyalı Villa", "Kiralık Müstakil Villa"],
        3: ["Kiralık İş Yeri", "Kiralık Dükkan", "Kiralık Ofis", "Kiralık Mağaza", "Kiralık Plaza Katı", "Kiralık Ticari Alan"],
        4: ["Kiralık Arsa", "Kiralık Tarla", "Kiralık Bahçe", "Kiralık Etkinlik Alanı", "Kiralık Sergi Alanı", "Kiralık Açık Alan"],
        5: ["Kiralık Yazlık", "Kiralık Denize Yakın Yazlık", "Kiralık Site İçi Yazlık", "Kiralık Müstakil Yazlık", "Kiralık Eşyalı Yazlık", "Kiralık Tatil Evi"],
        6: ["Kiralık Depo", "Kiralık Antrepo", "Kiralık Soğuk Hava Deposu", "Kiralık Lojistik Depo", "Kiralık Sanayi Deposu", "Kiralık Eşya Deposu"]
      },
      daily: {
        1: ["Günlük Kiralık Daire", "Günlük Kiralık Lüks Daire", "Günlük Kiralık Eşyalı Daire", "Günlük Kiralık Residence", "Günlük Kiralık Stüdyo", "Günlük Kiralık Apart"],
        2: ["Günlük Kiralık Villa", "Günlük Kiralık Lüks Villa", "Günlük Kiralık Havuzlu Villa", "Günlük Kiralık Eşyalı Villa", "Günlük Kiralık Deniz Manzaralı Villa", "Günlük Kiralık Tatil Villası"],
        3: ["Günlük Kiralık İş Yeri", "Günlük Kiralık Toplantı Salonu", "Günlük Kiralık Ofis", "Günlük Kiralık Etkinlik Alanı", "Günlük Kiralık Showroom", "Günlük Kiralık Stüdyo"],
        4: ["Günlük Kiralık Arsa", "Günlük Kiralık Etkinlik Alanı", "Günlük Kiralık Bahçe", "Günlük Kiralık Açık Alan", "Günlük Kiralık Organizasyon Alanı", "Günlük Kiralık Sergi Alanı"],
        5: ["Günlük Kiralık Yazlık", "Günlük Kiralık Tatil Evi", "Günlük Kiralık Site İçi Yazlık", "Günlük Kiralık Denize Yakın Yazlık", "Günlük Kiralık Müstakil Yazlık", "Günlük Kiralık Eşyalı Yazlık"],
        6: ["Günlük Kiralık Depo", "Günlük Kiralık Stok Alanı", "Günlük Kiralık Depolama Alanı", "Günlük Kiralık Eşya Deposu", "Günlük Kiralık Geçici Depo", "Günlük Kiralık Soğuk Hava Deposu"]
      }
    };

    // District names for each city
    const cityDistricts: Record<number, string[]> = {
      1: ["Kadıköy", "Beşiktaş", "Şişli", "Üsküdar", "Beyoğlu", "Bakırköy", "Ataşehir", "Maltepe", "Sarıyer", "Bahçelievler"],
      2: ["Çankaya", "Keçiören", "Mamak", "Etimesgut", "Yenimahalle", "Altındağ", "Gölbaşı", "Polatlı", "Sincan", "Beypazarı"],
      3: ["Konak", "Karşıyaka", "Bornova", "Bayraklı", "Buca", "Çeşme", "Urla", "Güzelbahçe", "Menderes", "Karabağlar"],
      4: ["Muratpaşa", "Konyaaltı", "Kepez", "Alanya", "Manavgat", "Serik", "Kemer", "Kaş", "Kumluca", "Finike"],
      5: ["Nilüfer", "Osmangazi", "Yıldırım", "Gemlik", "Mudanya", "İnegöl", "Orhangazi", "Gürsu", "Kestel", "Karacabey"],
      6: ["Bodrum", "Fethiye", "Marmaris", "Milas", "Dalaman", "Datça", "Köyceğiz", "Ortaca", "Ula", "Yatağan"],
      7: ["Tepebaşı", "Odunpazarı", "Sivrihisar", "Çifteler", "Mahmudiye", "Seyitgazi", "Alpu", "Günyüzü", "İnönü", "Mihalgazi"],
      8: ["Efeler", "Kuşadası", "Nazilli", "Söke", "Didim", "Çine", "Germencik", "İncirliova", "Koçarlı", "Kuyucak"],
      9: ["Ortahisar", "Akçaabat", "Araklı", "Arsin", "Çaykara", "Dernekpazarı", "Düzköy", "Hayrat", "Köprübaşı", "Maçka"],
      10: ["Selçuklu", "Meram", "Karatay", "Akşehir", "Beyşehir", "Bozkır", "Çumra", "Doğanhisar", "Ereğli", "Hadim"]
    };
    
    // Address suffixes
    const addressSuffixes = [
      "Sokak", "Caddesi", "Bulvarı", "Mahallesi", "Sitesi", "Konutları", "Evleri", "Apartmanı", "Residence", "Plaza"
    ];
    
    // Street names
    const streetNames = [
      "Atatürk", "Cumhuriyet", "İstiklal", "Bağdat", "Gazi", "Millet", "Vatan", "Fatih", "Mevlana", "Piri Reis",
      "Adalet", "Çınar", "Güneş", "Lale", "Zambak", "Menekşe", "Yasemin", "Akasya", "Çamlık", "Deniz",
      "Nergis", "Papatya", "Gül", "Orkide", "Manolya", "Fulya", "Ihlamur", "Palmiye", "Zeytin", "Bahar"
    ];
    
    // Generate 200 listings
    const listingsData: InsertListing[] = [];
    
    for (let i = 1; i <= 200; i++) {
      // Determine property details
      const cityId = randomInt(1, 10);
      const propertyTypeId = randomInt(1, 6);
      const listingType = ["sell", "rent", "daily"][randomInt(0, 2)];
      const userId = randomInt(1, usersData.length);
      
      // Some property types need room counts
      let roomCount = null;
      let bathroomCount = null;
      let parkingCount = null;
      
      if (propertyTypeId === 1 || propertyTypeId === 2 || propertyTypeId === 5) {
        // For apartments, villas, and summer houses
        roomCount = randomInt(1, 6);
        bathroomCount = randomInt(1, Math.max(1, Math.ceil(roomCount / 2)));
        parkingCount = randomInt(0, 3);
      } else if (propertyTypeId === 3) {
        // For shops/offices
        bathroomCount = randomInt(1, 2);
      }
      
      // Square meters based on property type
      let squareMeters;
      switch (propertyTypeId) {
        case 1: // Apartment
          squareMeters = randomInt(60, 250);
          break;
        case 2: // Villa
          squareMeters = randomInt(150, 600);
          break;
        case 3: // Commercial
          squareMeters = randomInt(50, 400);
          break;
        case 4: // Land
          squareMeters = randomInt(300, 5000);
          break;
        case 5: // Summer house
          squareMeters = randomInt(80, 300);
          break;
        case 6: // Warehouse
          squareMeters = randomInt(200, 1500);
          break;
        default:
          squareMeters = randomInt(80, 200);
      }
      
      // Generate listing price based on property type, listing type, and size
      let price;
      let rentPeriod = null;
      
      if (listingType === "sell") {
        switch (propertyTypeId) {
          case 1: // Apartment
            price = randomInt(1500000, 12000000);
            break;
          case 2: // Villa
            price = randomInt(5000000, 30000000);
            break;
          case 3: // Commercial
            price = randomInt(2000000, 15000000);
            break;
          case 4: // Land
            price = randomInt(500000, 8000000);
            break;
          case 5: // Summer house
            price = randomInt(2500000, 20000000);
            break;
          case 6: // Warehouse
            price = randomInt(3000000, 10000000);
            break;
          default:
            price = randomInt(2000000, 5000000);
        }
      } else if (listingType === "rent") {
        rentPeriod = "monthly";
        switch (propertyTypeId) {
          case 1: // Apartment
            price = randomInt(8000, 40000);
            break;
          case 2: // Villa
            price = randomInt(25000, 100000);
            break;
          case 3: // Commercial
            price = randomInt(15000, 80000);
            break;
          case 4: // Land
            price = randomInt(5000, 30000);
            break;
          case 5: // Summer house
            price = randomInt(20000, 80000);
            break;
          case 6: // Warehouse
            price = randomInt(20000, 60000);
            break;
          default:
            price = randomInt(10000, 30000);
        }
      } else { // daily
        rentPeriod = "daily";
        switch (propertyTypeId) {
          case 1: // Apartment
            price = randomInt(1000, 5000);
            break;
          case 2: // Villa
            price = randomInt(3000, 15000);
            break;
          case 3: // Commercial
            price = randomInt(2000, 10000);
            break;
          case 4: // Land
            price = randomInt(1500, 7000);
            break;
          case 5: // Summer house
            price = randomInt(2500, 12000);
            break;
          case 6: // Warehouse
            price = randomInt(2000, 8000);
            break;
          default:
            price = randomInt(1500, 5000);
        }
      }
      
      // Adjust price based on city (some cities are more expensive)
      if (cityId === 1) { // Istanbul
        price = Math.round(price * 1.3); // 30% more expensive
      } else if (cityId === 3 || cityId === 4 || cityId === 6) { // Izmir, Antalya, Mugla
        price = Math.round(price * 1.15); // 15% more expensive
      }
      
      // Generate random lat/lng coordinates based on city
      const baseLat = cityCoordinates[cityId as keyof typeof cityCoordinates].lat;
      const baseLng = cityCoordinates[cityId as keyof typeof cityCoordinates].lng;
      const latOffset = randomFloat(-0.05, 0.05);
      const lngOffset = randomFloat(-0.05, 0.05);
      const latitude = baseLat + latOffset;
      const longitude = baseLng + lngOffset;
      
      // Select random district for the city
      const district = cityDistricts[cityId][randomInt(0, cityDistricts[cityId].length - 1)];
      
      // Generate address
      const streetName = streetNames[randomInt(0, streetNames.length - 1)];
      const addressSuffix = addressSuffixes[randomInt(0, addressSuffixes.length - 1)];
      const streetNumber = randomInt(1, 200);
      let address = `${streetName} ${addressSuffix} No:${streetNumber}`;
      
      // Maybe add apartment/flat number
      if (propertyTypeId === 1) {
        address += `, Daire:${randomInt(1, 30)}`;
      } else if (propertyTypeId === 3 && Math.random() > 0.5) {
        address += `, No:${randomInt(1, 50)}`;
      }
      
      // Randomly decide if property is featured (about 10% are featured)
      const isFeatured = Math.random() < 0.1;
      
      // Select property title
      const titleOptions = propertyTitles[listingType][propertyTypeId];
      const baseTitle = titleOptions[randomInt(0, titleOptions.length - 1)];
      const title = `${baseTitle} - ${district}`;
      
      // Get description
      const description = getPropertyDescription(propertyTypeId, listingType, roomCount || 0);
      
      // Select random images
      const imageSet = propertyImages[propertyTypeId];
      const imageCount = randomInt(2, Math.min(4, imageSet.length));
      const shuffledImages = [...imageSet].sort(() => 0.5 - Math.random());
      const selectedImages = shuffledImages.slice(0, imageCount);
      
      // Create listing
      listingsData.push({
        title,
        description,
        price,
        squareMeters,
        address,
        district,
        cityId,
        propertyTypeId,
        listingType,
        bathroomCount,
        roomCount,
        parkingCount,
        rentPeriod,
        imageUrls: selectedImages,
        // Add user ID - assign a random real estate agent
        userId,
        // We will use random coordinates for demonstrations
        latitude,
        longitude,
        isFeatured: Math.random() < 0.2 // 20% chance of being featured
      });
    }
    
    // Add some featured properties
    // Make sure we have at least 10 featured properties
    const featuredCount = listingsData.filter(l => l.isFeatured).length;
    if (featuredCount < 10) {
      const nonFeatured = listingsData.filter(l => !l.isFeatured);
      const toFeature = randomInt(10 - featuredCount, 20 - featuredCount);
      
      for (let i = 0; i < Math.min(toFeature, nonFeatured.length); i++) {
        const randomIndex = randomInt(0, nonFeatured.length - 1);
        nonFeatured[randomIndex].isFeatured = true;
      }
    }
    
    // Create the listings
    listingsData.forEach(listing => this.createListing(listing));
  }
}