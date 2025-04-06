import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { MemStorage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  // Parolayı ve salt'ı ayır
  const [hashed, salt] = stored.split(".");
  
  // storage.ts'deki hash fonksiyonu ile aynı mantığı kullan
  if (salt === "emlakcompasssalt") {
    // storage.ts formatına göre basit doğrulama (güvenli değil, sadece demo amaçlı)
    const suppliedHashed = Buffer.from(supplied).toString("hex");
    return suppliedHashed === hashed;
  } else {
    // Gerçek scrypt karşılaştırması
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return timingSafeEqual(hashedBuf, suppliedBuf);
  }
}

export function setupAuth(app: Express, storage: MemStorage) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "emlak_compass_secret_key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 86400000, // 24 saat
      secure: process.env.NODE_ENV === "production"
    }
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Kullanıcı kayıt API'si
  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: "Bu kullanıcı adı zaten kullanımda" 
        });
      }

      const hashedPassword = await hashPassword(req.body.password);
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword,
        role: req.body.role || "agent" // Varsayılan rol: emlakçı
      });

      req.login(user, (err) => {
        if (err) return next(err);
        // Parola bilgisini sonuçtan çıkar
        const { password, ...userWithoutPassword } = user;
        res.status(201).json({
          success: true,
          user: userWithoutPassword
        });
      });
    } catch (error) {
      next(error);
    }
  });

  // Kullanıcı girişi API'si
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: Error, user: SelectUser) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: "Geçersiz kullanıcı adı veya parola" 
        });
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        // Parola bilgisini sonuçtan çıkar
        const { password, ...userWithoutPassword } = user;
        return res.json({
          success: true,
          user: userWithoutPassword
        });
      });
    })(req, res, next);
  });

  // Kullanıcı çıkışı API'si
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ success: true, message: "Çıkış başarılı" });
    });
  });

  // Geçerli kullanıcı bilgisi API'si
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ 
        success: false, 
        message: "Giriş yapılmamış" 
      });
    }
    // Parola bilgisini sonuçtan çıkar
    const { password, ...userWithoutPassword } = req.user as SelectUser;
    res.json({
      success: true,
      user: userWithoutPassword
    });
  });

  // Kullanıcıları listeleme API'si (Sadece admin için)
  app.get("/api/users", (req, res) => {
    if (!req.isAuthenticated() || (req.user as SelectUser).role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "Bu işlem için yetkiniz yok" 
      });
    }
    
    storage.getUsers().then(users => {
      // Tüm kullanıcılardan parola bilgisini çıkar
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json({
        success: true,
        users: usersWithoutPasswords
      });
    }).catch(error => {
      res.status(500).json({ 
        success: false, 
        message: "Kullanıcılar listelenirken bir hata oluştu" 
      });
    });
  });

  // Kullanıcı güncelleme API'si (Sadece admin ve kendi bilgilerini güncelleyebilir)
  app.put("/api/users/:id", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ 
        success: false, 
        message: "Giriş yapılmamış" 
      });
    }
    
    const userId = parseInt(req.params.id);
    const currentUser = req.user as SelectUser;
    
    // Kullanıcı sadece kendi bilgilerini veya admin ise herhangi bir kullanıcıyı güncelleyebilir
    if (currentUser.id !== userId && currentUser.role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "Bu işlem için yetkiniz yok" 
      });
    }
    
    // Parola güncellenecekse hashle
    const updateData = { ...req.body };
    if (updateData.password) {
      hashPassword(updateData.password).then(hashedPassword => {
        updateData.password = hashedPassword;
        updateUser();
      }).catch(error => {
        res.status(500).json({ 
          success: false, 
          message: "Parola güncellenirken bir hata oluştu" 
        });
      });
    } else {
      updateUser();
    }
    
    function updateUser() {
      // Admin değilse, rol değiştirmeye izin verme
      if (currentUser.role !== "admin" && updateData.role) {
        delete updateData.role;
      }
      
      storage.updateUser(userId, updateData).then(updatedUser => {
        if (!updatedUser) {
          return res.status(404).json({ 
            success: false, 
            message: "Kullanıcı bulunamadı" 
          });
        }
        
        // Parola bilgisini sonuçtan çıkar
        const { password, ...userWithoutPassword } = updatedUser;
        res.json({
          success: true,
          user: userWithoutPassword
        });
      }).catch(error => {
        res.status(500).json({ 
          success: false, 
          message: "Kullanıcı güncellenirken bir hata oluştu" 
        });
      });
    }
  });

  // Kullanıcı silme API'si (Sadece admin)
  app.delete("/api/users/:id", (req, res) => {
    if (!req.isAuthenticated() || (req.user as SelectUser).role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "Bu işlem için yetkiniz yok" 
      });
    }
    
    const userId = parseInt(req.params.id);
    
    // Admin kendisini silmeye çalışıyorsa engelle
    if ((req.user as SelectUser).id === userId) {
      return res.status(400).json({ 
        success: false, 
        message: "Kendi hesabınızı silemezsiniz" 
      });
    }
    
    storage.deleteUser(userId).then(success => {
      if (!success) {
        return res.status(404).json({ 
          success: false, 
          message: "Kullanıcı bulunamadı" 
        });
      }
      
      res.json({
        success: true,
        message: "Kullanıcı başarıyla silindi"
      });
    }).catch(error => {
      res.status(500).json({ 
        success: false, 
        message: "Kullanıcı silinirken bir hata oluştu" 
      });
    });
  });
}