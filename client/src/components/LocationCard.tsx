import { Link } from "wouter";
import { type City } from "@shared/schema";

interface LocationCardProps {
  city: City;
}

const LocationCard = ({ city }: LocationCardProps) => {
  return (
    <Link href={`/listings?cityId=${city.id}`}>
      <a className="group">
        <div className="relative rounded-lg overflow-hidden shadow-md">
          <img 
            src={city.imageUrl} 
            alt={city.name} 
            className="w-full h-36 object-cover group-hover:scale-110 transition duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C3E50]/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-3 text-white">
            <h3 className="font-medium">{city.name}</h3>
            <p className="text-xs">{city.listingCount} ilan</p>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default LocationCard;
