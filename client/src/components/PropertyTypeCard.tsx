import { Link } from "wouter";
import { type PropertyType } from "@shared/schema";
import {
  Building,
  Home,
  Store,
  Map,
  Hotel,
  Warehouse,
  Briefcase,
  Box,
  Sun
} from "lucide-react";

interface PropertyTypeCardProps {
  propertyType: PropertyType;
}

const PropertyTypeCard = ({ propertyType }: PropertyTypeCardProps) => {
  const getIcon = () => {
    const iconClasses = "h-8 w-8 transform transition-transform duration-500 group-hover:scale-125 group-hover:rotate-[-10deg]";
    
    switch (propertyType.icon) {
      case 'building':
        return <Building className={iconClasses} />;
      case 'home':
        return <Home className={iconClasses} />;
      case 'store':
        return <Store className={iconClasses} />;
      case 'map':
        return <Map className={iconClasses} />;
      case 'hotel':
        return <Hotel className={iconClasses} />;
      case 'warehouse':
        return <Warehouse className={iconClasses} />;
      case 'briefcase':
        return <Briefcase className={iconClasses} />;
      case 'box':
        return <Box className={iconClasses} />;
      case 'sun':
        return <Sun className={iconClasses} />;
      default:
        return <Building className={iconClasses} />;
    }
  };

  return (
    <Link href={`/listings?propertyTypeId=${propertyType.id}`}>
      <a className="group">
        <div className="relative bg-[#ECF0F1] rounded-lg p-6 text-center hover:bg-gradient-to-r hover:from-[#3498DB] hover:to-[#2980B9] hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg overflow-hidden">
          {/* Background shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
          
          <div className="text-3xl text-[#3498DB] group-hover:text-white mb-4 relative z-10">
            {getIcon()}
          </div>
          <h3 className="font-medium transform transition-all duration-300 group-hover:scale-110">{propertyType.name}</h3>
        </div>
      </a>
    </Link>
  );
};

export default PropertyTypeCard;
