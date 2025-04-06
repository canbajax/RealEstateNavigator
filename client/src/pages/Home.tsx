import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import LocationSearch from "@/components/LocationSearch";
import PropertyTypes from "@/components/PropertyTypes";
import ContactForm from "@/components/ContactForm";
import { MapPin, PhoneCall, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Home = () => {
  return (
    <>
      <Hero />
      
      <FeaturedProperties />
      
      <LocationSearch />
      
      <PropertyTypes />
      
      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#2C3E50] text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-bold text-2xl md:text-3xl mb-6">Bize Ulaşın</h2>
              <p className="mb-8">
                Emlak danışmanlarımız size yardımcı olmak için hazır. Sorularınız için bize 
                ulaşabilir veya ücretsiz danışmanlık hizmeti alabilirsiniz.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="text-[#3498DB] mt-1 mr-4">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium">Adres</h3>
                    <p className="text-[#ECF0F1]">Bağdat Caddesi No:123, Kadıköy, İstanbul</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-[#3498DB] mt-1 mr-4">
                    <PhoneCall size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium">Telefon</h3>
                    <p className="text-[#ECF0F1]">+90 (212) 123 45 67</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-[#3498DB] mt-1 mr-4">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium">E-posta</h3>
                    <p className="text-[#ECF0F1]">info@emlakcompass.com</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-medium mb-4">Bizi Takip Edin</h3>
                <div className="flex space-x-4">
                  <a 
                    href="#" 
                    className="bg-[#3498DB] hover:bg-[#5DADE2] text-white p-3 rounded-full transition"
                    aria-label="Facebook"
                  >
                    <Facebook size={16} />
                  </a>
                  <a 
                    href="#" 
                    className="bg-[#3498DB] hover:bg-[#5DADE2] text-white p-3 rounded-full transition"
                    aria-label="Twitter"
                  >
                    <Twitter size={16} />
                  </a>
                  <a 
                    href="#" 
                    className="bg-[#3498DB] hover:bg-[#5DADE2] text-white p-3 rounded-full transition"
                    aria-label="Instagram"
                  >
                    <Instagram size={16} />
                  </a>
                  <a 
                    href="#" 
                    className="bg-[#3498DB] hover:bg-[#5DADE2] text-white p-3 rounded-full transition"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={16} />
                  </a>
                </div>
              </div>
            </div>
            
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
