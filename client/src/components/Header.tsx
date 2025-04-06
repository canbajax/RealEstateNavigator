import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Compass, LogOut, User, UserPlus, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/use-auth";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Header = () => {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mortgageAmount, setMortgageAmount] = useState(1000000);
  const [mortgageYears, setMortgageYears] = useState(10);
  const [interestRate, setInterestRate] = useState(1.29);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorTab, setCalculatorTab] = useState<'kredi' | 'komisyon'>('kredi');
  
  // Komisyon hesaplama değişkenleri
  const [propertyValue, setPropertyValue] = useState(2000000);
  const [commissionRate, setCommissionRate] = useState(2);
  const [commissionType, setCommissionType] = useState<'satilik' | 'kiralik'>('satilik');
  const [vatRate, setVatRate] = useState(18);
  const { user, logoutMutation } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location === path;
  };
  
  // Kredi ödeme hesaplayıcı
  const calculateMonthlyPayment = () => {
    // Aylık faiz oranı (yıllık faiz / 12 / 100)
    const monthlyInterestRate = interestRate / 12 / 100;
    // Toplam ödeme sayısı (yıl * 12 ay)
    const numberOfPayments = mortgageYears * 12;
    
    // Aylık ödeme formülü: P = L[c(1 + c)^n]/[(1 + c)^n - 1]
    // P: aylık ödeme, L: kredi tutarı, c: aylık faiz oranı, n: ödeme sayısı
    const monthlyPayment = 
      (mortgageAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
      
    return isNaN(monthlyPayment) ? 0 : Math.round(monthlyPayment);
  };
  
  const totalPayment = calculateMonthlyPayment() * mortgageYears * 12;
  const totalInterest = totalPayment - mortgageAmount;
  
  // Komisyon hesaplama
  const calculateCommission = () => {
    // Satılık için oran üzerinden, kiralık için doğrudan 1 aylık kira bedeli
    if (commissionType === 'satilik') {
      return propertyValue * (commissionRate / 100);
    } else {
      // Kiralık için direkt 1 kira bedeli
      return propertyValue;
    }
  };
  
  // KDV dahil komisyon hesaplama
  const calculateCommissionWithVAT = () => {
    return calculateCommission() * (1 + vatRate / 100);
  };
  
  // Para birimi formatter
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { 
      style: 'currency', 
      currency: 'TRY',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Compass className="text-[#3498DB] h-8 w-8 mr-2" />
              <span className="font-bold text-xl sm:text-2xl text-[#2C3E50]">
                Co <span className="text-[#3498DB]">Worker</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/">
              <a className={`font-medium ${isActive('/') ? 'text-[#3498DB]' : 'text-[#2C3E50] hover:text-[#3498DB]'} transition`}>
                Anasayfa
              </a>
            </Link>
            <Link href="/listings">
              <a className={`font-medium ${location.includes('/listings') ? 'text-[#3498DB]' : 'text-[#2C3E50] hover:text-[#3498DB]'} transition`}>
                İlanlar
              </a>
            </Link>
            <Link href="/contact">
              <a className={`font-medium ${isActive('/contact') ? 'text-[#3498DB]' : 'text-[#2C3E50] hover:text-[#3498DB]'} transition`}>
                İletişim
              </a>
            </Link>
            <a 
              className={`font-medium ${showCalculator ? 'text-[#3498DB]' : 'text-[#2C3E50] hover:text-[#3498DB]'} transition cursor-pointer`}
              onClick={() => setShowCalculator(true)}
            >
              Hesaplama
            </a>
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            {/* Hesaplama Araçları Dialog */}
            <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
              <DialogTrigger asChild>
                <span></span>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Hesaplama Araçları</DialogTitle>
                  <DialogDescription>
                    Emlak işlemleriniz için hesaplama araçları
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="kredi" className="w-full" onValueChange={(value) => setCalculatorTab(value as 'kredi' | 'komisyon')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="kredi">Kredi Hesaplama</TabsTrigger>
                    <TabsTrigger value="komisyon">Komisyon Hesaplama</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="kredi" className="mt-4">
                    <div className="grid gap-4 py-2">
                      <div className="grid gap-2">
                        <Label htmlFor="amount">Kredi Tutarı: {formatCurrency(mortgageAmount)}</Label>
                        <div className="flex gap-2 items-center">
                          <Slider
                            id="amount"
                            min={100000}
                            max={10000000}
                            step={50000}
                            value={[mortgageAmount]}
                            onValueChange={(value) => setMortgageAmount(value[0])}
                            className="py-4 flex-1"
                          />
                          <Input
                            type="number"
                            value={mortgageAmount}
                            onChange={(e) => setMortgageAmount(Number(e.target.value))}
                            className="w-24"
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>100.000 ₺</span>
                          <span>10.000.000 ₺</span>
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="years">Vade (Yıl): {mortgageYears} yıl</Label>
                        <div className="flex gap-2 items-center">
                          <Slider
                            id="years"
                            min={1}
                            max={30}
                            step={1}
                            value={[mortgageYears]}
                            onValueChange={(value) => setMortgageYears(value[0])}
                            className="py-4 flex-1"
                          />
                          <Input
                            type="number"
                            value={mortgageYears}
                            onChange={(e) => setMortgageYears(Number(e.target.value))}
                            className="w-24"
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>1 yıl</span>
                          <span>30 yıl</span>
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="interest">Faiz Oranı: %{interestRate}</Label>
                        <div className="flex gap-2 items-center">
                          <Slider
                            id="interest"
                            min={0.1}
                            max={5}
                            step={0.01}
                            value={[interestRate]}
                            onValueChange={(value) => setInterestRate(value[0])}
                            className="py-4 flex-1"
                          />
                          <Input
                            type="number"
                            value={interestRate}
                            onChange={(e) => setInterestRate(Number(e.target.value))}
                            className="w-24"
                            step="0.01"
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>%0.10</span>
                          <span>%5.00</span>
                        </div>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Aylık Ödeme</p>
                            <p className="text-lg font-bold">{formatCurrency(calculateMonthlyPayment())}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Toplam Ödeme</p>
                            <p className="text-lg font-bold">{formatCurrency(totalPayment)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Toplam Faiz</p>
                            <p className="text-lg font-bold">{formatCurrency(totalInterest)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Faiz Oranı</p>
                            <p className="text-lg font-bold">%{interestRate}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="komisyon" className="mt-4">
                    <div className="grid gap-4 py-2">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroup 
                            defaultValue="satilik" 
                            value={commissionType}
                            onValueChange={(value) => setCommissionType(value as 'satilik' | 'kiralik')}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="satilik" id="satilik" />
                              <Label htmlFor="satilik">Satılık</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="kiralik" id="kiralik" />
                              <Label htmlFor="kiralik">Kiralık</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="propertyValue">
                          {commissionType === 'satilik' ? 'Gayrimenkul Değeri' : 'Aylık Kira Bedeli'}: {formatCurrency(propertyValue)}
                        </Label>
                        <div className="flex gap-2 items-center">
                          <Slider
                            id="propertyValue"
                            min={commissionType === 'satilik' ? 100000 : 1000}
                            max={commissionType === 'satilik' ? 20000000 : 100000}
                            step={commissionType === 'satilik' ? 100000 : 500}
                            value={[propertyValue]}
                            onValueChange={(value) => setPropertyValue(value[0])}
                            className="py-4 flex-1"
                          />
                          <Input
                            type="number"
                            value={propertyValue}
                            onChange={(e) => setPropertyValue(Number(e.target.value))}
                            className="w-24"
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{commissionType === 'satilik' ? '100.000 ₺' : '1.000 ₺'}</span>
                          <span>{commissionType === 'satilik' ? '20.000.000 ₺' : '100.000 ₺'}</span>
                        </div>
                      </div>
                      
                      {commissionType === 'satilik' && (
                        <div className="grid gap-2">
                          <Label htmlFor="commissionRate">Komisyon Oranı: %{commissionRate}</Label>
                          <div className="flex gap-2 items-center">
                            <Slider
                              id="commissionRate"
                              min={0.5}
                              max={5}
                              step={0.1}
                              value={[commissionRate]}
                              onValueChange={(value) => setCommissionRate(value[0])}
                              className="py-4 flex-1"
                            />
                            <Input
                              type="number"
                              value={commissionRate}
                              onChange={(e) => setCommissionRate(Number(e.target.value))}
                              className="w-24"
                              step="0.1"
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>%0.5</span>
                            <span>%5.0</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="grid gap-2">
                        <Label htmlFor="vatRate">KDV Oranı: %{vatRate}</Label>
                        <div className="flex gap-2 items-center">
                          <Slider
                            id="vatRate"
                            min={0}
                            max={20}
                            step={1}
                            value={[vatRate]}
                            onValueChange={(value) => setVatRate(value[0])}
                            className="py-4 flex-1"
                          />
                          <Input
                            type="number"
                            value={vatRate}
                            onChange={(e) => setVatRate(Number(e.target.value))}
                            className="w-24"
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>%0</span>
                          <span>%20</span>
                        </div>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Komisyon Tutarı</p>
                            <p className="text-lg font-bold">{formatCurrency(calculateCommission())}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">KDV Dahil (%{vatRate})</p>
                            <p className="text-lg font-bold">{formatCurrency(calculateCommissionWithVAT())}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              {commissionType === 'satilik' ? 'Gayrimenkul Değeri' : 'Aylık Kira'}
                            </p>
                            <p className="text-lg font-bold">{formatCurrency(propertyValue)}</p>
                          </div>
                          {commissionType === 'satilik' ? (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Komisyon Oranı</p>
                              <p className="text-lg font-bold">%{commissionRate}</p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Komisyon Tutarı</p>
                              <p className="text-lg font-bold">1 Aylık Kira</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <DialogFooter>
                  <Button 
                    onClick={() => setShowCalculator(false)}
                    className="bg-[#3498DB] hover:bg-[#5DADE2]"
                  >
                    Kapat
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {!user ? (
              // Kullanıcı giriş yapmamış
              <Link href="/auth">
                <Button variant="outline" className="border-[#3498DB] text-[#3498DB] hover:bg-[#3498DB] hover:text-white">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Giriş Yap
                </Button>
              </Link>
            ) : (
              // Kullanıcı giriş yapmış
              <div className="flex items-center space-x-4">
                {user.role === "admin" && (
                  <Link href="/admin">
                    <Button variant="outline" className="border-[#3498DB] text-[#3498DB] hover:bg-[#3498DB] hover:text-white">
                      Yönetim Paneli
                    </Button>
                  </Link>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatarUrl || ""} alt={user.fullName} />
                        <AvatarFallback className="bg-[#3498DB] text-white">
                          {user.fullName.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Çıkış Yap
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu} 
              aria-label="Toggle mobile menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
                <line x1="4" x2="20" y1="12" y2="12"></line>
                <line x1="4" x2="20" y1="6" y2="6"></line>
                <line x1="4" x2="20" y1="18" y2="18"></line>
              </svg>
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation (Hidden by default) */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-4 space-y-1">
            <Link href="/">
              <a className="block px-3 py-2 rounded-md font-medium text-[#2C3E50] hover:bg-[#ECF0F1]">
                Anasayfa
              </a>
            </Link>
            <Link href="/listings">
              <a className="block px-3 py-2 rounded-md font-medium text-[#2C3E50] hover:bg-[#ECF0F1]">
                İlanlar
              </a>
            </Link>
            <Link href="/contact">
              <a className="block px-3 py-2 rounded-md font-medium text-[#2C3E50] hover:bg-[#ECF0F1]">
                İletişim
              </a>
            </Link>
            <a 
              className={`block px-3 py-2 rounded-md font-medium ${showCalculator ? 'text-[#3498DB]' : 'text-[#2C3E50]'} hover:bg-[#ECF0F1] cursor-pointer`}
              onClick={() => setShowCalculator(true)}
            >
              Hesaplama
            </a>
            <div className="flex flex-col space-y-2 mt-4">
              {!user ? (
                <Link href="/auth">
                  <Button variant="outline" className="border-[#3498DB] text-[#3498DB] hover:bg-[#3498DB] hover:text-white w-full">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Giriş Yap
                  </Button>
                </Link>
              ) : (
                <>
                  {user.role === "admin" && (
                    <Link href="/admin">
                      <Button variant="outline" className="border-[#3498DB] text-[#3498DB] hover:bg-[#3498DB] hover:text-white w-full">
                        Yönetim Paneli
                      </Button>
                    </Link>
                  )}
                  <div className="flex items-center gap-2 px-3 py-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl || ""} alt={user.fullName} />
                      <AvatarFallback className="bg-[#3498DB] text-white">
                        {user.fullName.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.fullName}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white w-full"
                    onClick={() => logoutMutation.mutate()}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Çıkış Yap
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;