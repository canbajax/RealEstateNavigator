import { Link } from "wouter";
import { type City } from "@shared/schema";

interface LocationCardProps {
  city: City;
}

const LocationCard = ({ city }: LocationCardProps) => {
  return (
    <Link href={`/listings?cityId=${city.id}`}>
      <a className="group">
        <div className="relative rounded-lg overflow-hidden shadow-md transform transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02]">
          {/* Background shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out z-10"></div>
          
          <img 
            src={city.imageUrl} 
            alt={city.name} 
            className="w-full h-40 object-cover transform transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C3E50]/80 via-[#2C3E50]/30 to-transparent group-hover:from-[#3498DB]/70 group-hover:via-[#3498DB]/30 transition-all duration-300"></div>
          
          <div className="absolute bottom-0 left-0 p-4 text-white w-full transform transition-all duration-300 group-hover:translate-y-[-5px]">
            <h3 className="font-semibold text-lg transform group-hover:scale-105 transition-transform duration-300">{city.name}</h3>
            <div className="flex items-center mt-1 opacity-80 group-hover:opacity-100">
              <span className="inline-block w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              <p className="text-sm">{city.listingCount} ilan</p>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default LocationCard;
