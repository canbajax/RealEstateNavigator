import { useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { Redirect } from "wouter";
import { Loader2, Settings, User, Home, ListFilter, Plus } from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "../lib/queryClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Listing, User as UserType } from "@shared/schema";

// API yanıt tipleri
interface AdminStats {
  success: boolean;
  stats: {
    totalUsers: number;
    totalListings: number;
    sellListings: number;
    rentListings: number;
  };
}

// Admin sayfası
export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Kullanıcı yükleniyorsa yükleme ekranı göster
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  // Kullanıcı giriş yapmamışsa veya admin değilse yönlendir
  if (!user || user.role !== "admin") {
    return <Redirect to="/" />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Yönetim Paneli</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="overview">
            <Home className="h-4 w-4 mr-2" />
            Genel Bakış
          </TabsTrigger>
          <TabsTrigger value="users">
            <User className="h-4 w-4 mr-2" />
            Emlak Danışmanları
          </TabsTrigger>
          <TabsTrigger value="listings">
            <ListFilter className="h-4 w-4 mr-2" />
            İlanlar
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Ayarlar
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <AdminStatsCards />
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Son Eklenen İlanlar</CardTitle>
                <CardDescription>Son 10 emlak ilanı</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Bu bölüm geliştirme aşamasındadır
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Son Kayıt Olan Emlakçılar</CardTitle>
                <CardDescription>Son 10 emlak danışmanı</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Bu bölüm geliştirme aşamasındadır
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Emlak Danışmanları</CardTitle>
                <CardDescription>Sistemdeki tüm emlak danışmanlarını yönetin</CardDescription>
              </div>
              <Button className="bg-[#3498DB] text-white hover:bg-[#5DADE2]">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Danışman Ekle
              </Button>
            </CardHeader>
            <CardContent>
              <UsersTable />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="listings">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Emlak İlanları</CardTitle>
                <CardDescription>Tüm emlak ilanlarını yönetin</CardDescription>
              </div>
              <Button className="bg-[#3498DB] text-white hover:bg-[#5DADE2]">
                <Plus className="h-4 w-4 mr-2" />
                Yeni İlan Ekle
              </Button>
            </CardHeader>
            <CardContent>
              <ListingsTable />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Sistem Ayarları</CardTitle>
              <CardDescription>Sistem ayarlarını ve yapılandırmayı yönetin</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Bu bölüm geliştirme aşamasındadır
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// İstatistik kartları bileşeni
function AdminStatsCards() {
  // İstatistik verilerini çek
  const { data: statsData, isLoading, error } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
                  <div className="h-7 w-16 animate-pulse rounded bg-muted"></div>
                </div>
                <div className="h-10 w-10 animate-pulse rounded-full bg-muted"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !statsData) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-center text-red-500">
          <p>İstatistik verileri yüklenirken bir hata oluştu.</p>
        </CardContent>
      </Card>
    );
  }

  const { stats } = statsData;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
        title="Toplam İlanlar"
        value={stats.totalListings.toString()}
        icon={<ListFilter className="h-8 w-8 text-blue-500" />}
      />
      <DashboardCard
        title="Toplam Emlakçılar"
        value={stats.totalUsers.toString()}
        icon={<User className="h-8 w-8 text-green-500" />}
      />
      <DashboardCard
        title="Satılık İlanlar"
        value={stats.sellListings.toString()}
        icon={<Home className="h-8 w-8 text-orange-500" />}
      />
      <DashboardCard
        title="Kiralık İlanlar"
        value={stats.rentListings.toString()}
        icon={<Home className="h-8 w-8 text-violet-500" />}
      />
    </div>
  );
}

// Kullanıcılar tablosu
function UsersTable() {
  // Kullanıcı verilerini çek
  const { data: userData, isLoading, error } = useQuery<{ success: boolean; users: Omit<UserType, "password">[] }>({
    queryKey: ["/api/users"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-500">Kullanıcılar yüklenirken bir hata oluştu.</p>
      </div>
    );
  }

  if (userData.users.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Henüz kayıtlı emlakçı bulunmamaktadır.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-2">Emlakçı</th>
            <th className="text-left py-3 px-2">E-posta</th>
            <th className="text-left py-3 px-2">Telefon</th>
            <th className="text-left py-3 px-2">Rol</th>
            <th className="text-right py-3 px-2">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {userData.users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-muted/50">
              <td className="py-3 px-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl || ""} alt={user.fullName} />
                    <AvatarFallback className="bg-[#3498DB] text-white">
                      {user.fullName.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span>{user.fullName}</span>
                </div>
              </td>
              <td className="py-3 px-2">{user.email}</td>
              <td className="py-3 px-2">{user.phone || "-"}</td>
              <td className="py-3 px-2 capitalize">{user.role}</td>
              <td className="py-3 px-2 text-right">
                <Button variant="ghost" size="sm">Düzenle</Button>
                {user.role !== "admin" && (
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">Sil</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// İlanlar tablosu
function ListingsTable() {
  // İlan verilerini çek
  const { data: listings, isLoading, error } = useQuery<Listing[]>({
    queryKey: ["/api/listings"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (error || !listings) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-500">İlanlar yüklenirken bir hata oluştu.</p>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Henüz kayıtlı ilan bulunmamaktadır.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-2">İlan Başlığı</th>
            <th className="text-left py-3 px-2">Fiyat</th>
            <th className="text-left py-3 px-2">Tür</th>
            <th className="text-left py-3 px-2">Konum</th>
            <th className="text-left py-3 px-2">Tarih</th>
            <th className="text-right py-3 px-2">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <tr key={listing.id} className="border-b hover:bg-muted/50">
              <td className="py-3 px-2">
                <div className="flex items-center gap-2">
                  <img
                    src={listing.imageUrls[0]}
                    alt={listing.title}
                    className="h-10 w-10 object-cover rounded"
                  />
                  <span className="line-clamp-1">{listing.title}</span>
                </div>
              </td>
              <td className="py-3 px-2">
                {listing.price.toLocaleString("tr-TR")} ₺
                {listing.listingType === "rent" && (
                  <span className="text-xs text-muted-foreground">/ay</span>
                )}
              </td>
              <td className="py-3 px-2 capitalize">
                {listing.listingType === "sell" ? "Satılık" : "Kiralık"}
              </td>
              <td className="py-3 px-2">{listing.district}</td>
              <td className="py-3 px-2">
                {new Date(listing.postedAt).toLocaleDateString("tr-TR")}
              </td>
              <td className="py-3 px-2 text-right">
                <Button variant="ghost" size="sm">Düzenle</Button>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">Sil</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Gösterge Kartı Bileşeni
function DashboardCard({ 
  title, 
  value, 
  icon 
}: { 
  title: string, 
  value: string, 
  icon: React.ReactNode 
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}