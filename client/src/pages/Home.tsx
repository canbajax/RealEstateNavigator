import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import PropertyTypes from "@/components/PropertyTypes";
import OurAgents from "@/components/OurAgents";
import ContactForm from "@/components/ContactForm";
import { MapPin, PhoneCall, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { ContactInfo } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
  // İletişim bilgilerini çekme
  const { data, isLoading, error } = useQuery<{ success: boolean; contactInfo: ContactInfo }>({
    queryKey: ["/api/site-settings/contact-info"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const contactInfo = data?.contactInfo;

  return (
    <>
      <Hero />
      
      <FeaturedProperties />
      
      <PropertyTypes />
      
      {/* Agents Section */}
      <OurAgents />
      
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
                    {isLoading ? (
                      <Skeleton className="h-4 w-48 bg-gray-400 mt-1" />
                    ) : (
                      <p className="text-[#ECF0F1]">{contactInfo?.address || "Adres bilgisi bulunamadı"}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-[#3498DB] mt-1 mr-4">
                    <PhoneCall size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium">Telefon</h3>
                    {isLoading ? (
                      <Skeleton className="h-4 w-32 bg-gray-400 mt-1" />
                    ) : (
                      <p className="text-[#ECF0F1]">{contactInfo?.phone || "Telefon bilgisi bulunamadı"}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-[#3498DB] mt-1 mr-4">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium">E-posta</h3>
                    {isLoading ? (
                      <Skeleton className="h-4 w-40 bg-gray-400 mt-1" />
                    ) : (
                      <p className="text-[#ECF0F1]">{contactInfo?.email || "E-posta bilgisi bulunamadı"}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-medium mb-4">Bizi Takip Edin</h3>
                <div className="flex space-x-4">
                  {contactInfo?.facebook && (
                    <a 
                      href={contactInfo.facebook} 
                      className="bg-[#3498DB] hover:bg-[#5DADE2] text-white p-3 rounded-full transition"
                      aria-label="Facebook"
                    >
                      <Facebook size={16} />
                    </a>
                  )}
                  {contactInfo?.twitter && (
                    <a 
                      href={contactInfo.twitter} 
                      className="bg-[#3498DB] hover:bg-[#5DADE2] text-white p-3 rounded-full transition"
                      aria-label="Twitter"
                    >
                      <Twitter size={16} />
                    </a>
                  )}
                  {contactInfo?.instagram && (
                    <a 
                      href={contactInfo.instagram} 
                      className="bg-[#3498DB] hover:bg-[#5DADE2] text-white p-3 rounded-full transition"
                      aria-label="Instagram"
                    >
                      <Instagram size={16} />
                    </a>
                  )}
                  {contactInfo?.linkedin && (
                    <a 
                      href={contactInfo.linkedin} 
                      className="bg-[#3498DB] hover:bg-[#5DADE2] text-white p-3 rounded-full transition"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={16} />
                    </a>
                  )}
                  {!contactInfo?.facebook && !contactInfo?.twitter && !contactInfo?.instagram && !contactInfo?.linkedin && (
                    <>
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
                    </>
                  )}
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
