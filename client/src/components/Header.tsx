import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Compass className="text-[#3498DB] h-8 w-8 mr-2" />
              <span className="font-bold text-xl sm:text-2xl text-[#2C3E50]">
                Emlak<span className="text-[#3498DB]">Compass</span>
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
            <Link href="/listings?type=sell">
              <a className={`font-medium ${isActive('/listings?type=sell') ? 'text-[#3498DB]' : 'text-[#2C3E50] hover:text-[#3498DB]'} transition`}>
                Satılık
              </a>
            </Link>
            <Link href="/listings?type=rent">
              <a className={`font-medium ${isActive('/listings?type=rent') ? 'text-[#3498DB]' : 'text-[#2C3E50] hover:text-[#3498DB]'} transition`}>
                Kiralık
              </a>
            </Link>
            <Link href="/listings">
              <a className={`font-medium ${isActive('/listings') && !location.includes('?') ? 'text-[#3498DB]' : 'text-[#2C3E50] hover:text-[#3498DB]'} transition`}>
                Projeler
              </a>
            </Link>
            <Link href="/contact">
              <a className={`font-medium ${isActive('/contact') ? 'text-[#3498DB]' : 'text-[#2C3E50] hover:text-[#3498DB]'} transition`}>
                İletişim
              </a>
            </Link>
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" className="border-[#3498DB] text-[#3498DB] hover:bg-[#3498DB] hover:text-white">
              Giriş Yap
            </Button>
            <Button className="bg-[#3498DB] text-white hover:bg-[#5DADE2]">
              İlan Ver
            </Button>
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
            <Link href="/listings?type=sell">
              <a className="block px-3 py-2 rounded-md font-medium text-[#2C3E50] hover:bg-[#ECF0F1]">
                Satılık
              </a>
            </Link>
            <Link href="/listings?type=rent">
              <a className="block px-3 py-2 rounded-md font-medium text-[#2C3E50] hover:bg-[#ECF0F1]">
                Kiralık
              </a>
            </Link>
            <Link href="/listings">
              <a className="block px-3 py-2 rounded-md font-medium text-[#2C3E50] hover:bg-[#ECF0F1]">
                Projeler
              </a>
            </Link>
            <Link href="/contact">
              <a className="block px-3 py-2 rounded-md font-medium text-[#2C3E50] hover:bg-[#ECF0F1]">
                İletişim
              </a>
            </Link>
            <div className="flex flex-col space-y-2 mt-4">
              <Button variant="outline" className="border-[#3498DB] text-[#3498DB] hover:bg-[#3498DB] hover:text-white w-full">
                Giriş Yap
              </Button>
              <Button className="bg-[#3498DB] text-white hover:bg-[#5DADE2] w-full">
                İlan Ver
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
