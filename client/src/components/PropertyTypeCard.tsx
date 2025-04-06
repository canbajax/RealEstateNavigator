import { Link } from "wouter";
import { type PropertyType } from "@shared/schema";
import {
  Building,
  Home,
  Store,
  Map,
  Hotel,
  Warehouse
} from "lucide-react";

interface PropertyTypeCardProps {
  propertyType: PropertyType;
}

const PropertyTypeCard = ({ propertyType }: PropertyTypeCardProps) => {
  const getIcon = () => {
    switch (propertyType.icon) {
      case 'building':
        return <Building className="h-8 w-8" />;
      case 'home':
        return <Home className="h-8 w-8" />;
      case 'store':
        return <Store className="h-8 w-8" />;
      case 'map':
        return <Map className="h-8 w-8" />;
      case 'hotel':
        return <Hotel className="h-8 w-8" />;
      case 'warehouse':
        return <Warehouse className="h-8 w-8" />;
      default:
        return <Building className="h-8 w-8" />;
    }
  };

  return (
    <Link href={`/listings?propertyTypeId=${propertyType.id}`}>
      <a className="group">
        <div className="bg-[#ECF0F1] rounded-lg p-6 text-center hover:bg-[#3498DB] hover:text-white transition duration-300">
          <div className="text-3xl text-[#3498DB] group-hover:text-white mb-4">
            {getIcon()}
          </div>
          <h3 className="font-medium">{propertyType.name}</h3>
          <p className="text-xs mt-1 text-[#7F8C8D] group-hover:text-white">{propertyType.listingCount} ilan</p>
        </div>
      </a>
    </Link>
  );
};

export default PropertyTypeCard;
