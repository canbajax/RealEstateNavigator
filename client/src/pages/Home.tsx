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
      
      {/* Hizmetlerimiz Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-4">Hizmetlerimiz</h2>
            <p className="text-[#7F8C8D] max-w-3xl mx-auto">Profesyonel ekibimiz ile gayrimenkulünüzün gerçek piyasa değerini öğrenin. Doğru ve güvenilir hizmetler için yanınızdayız.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Gayrimenkul Değerleme Hizmeti */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full bg-[#3498DB] flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path><path d="M2 7h20"></path><path d="M22 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"></path><path d="M6 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"></path><path d="M14 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-center text-[#2C3E50] mb-4">Gayrimenkul Değerleme</h3>
              <p className="text-[#7F8C8D] text-center mb-6">Dairenizin, villanızın veya ticari gayrimenkullerinizin güncel piyasa değerini profesyonel değerleme uzmanlarımız ile öğrenin.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#3498DB] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="text-[#7F8C8D]">Konut Değerleme</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#3498DB] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="text-[#7F8C8D]">Ticari Değerleme</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#3498DB] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="text-[#7F8C8D]">Yatırım Analizi</span>
                </li>
              </ul>
              <div className="text-center">
                <a href="#" className="text-[#3498DB] font-medium hover:underline">Detaylı Bilgi →</a>
              </div>
            </div>
            
            {/* Satış ve Kiralama Süreç Desteği */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full bg-[#3498DB] flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M18 8a6 6 0 0 0-6-6 6 6 0 0 0-6 6c0 6 6 10 6 10s6-4 6-10"></path><circle cx="12" cy="8" r="2"></circle></svg>
              </div>
              <h3 className="text-xl font-bold text-center text-[#2C3E50] mb-4">Satış ve Kiralama Desteği</h3>
              <p className="text-[#7F8C8D] text-center mb-6">Gayrimenkul satış ve kiralama süreçlerinde profesyonel ekibimizle yanınızdayız. Karmaşık işlemleri sizin için basitleştiriyoruz.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#3498DB] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="text-[#7F8C8D]">Satış Süreci Desteği</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#3498DB] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="text-[#7F8C8D]">Kiralama Süreci Desteği</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#3498DB] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="text-[#7F8C8D]">Pazarlama Stratejileri</span>
                </li>
              </ul>
              <div className="text-center">
                <a href="#" className="text-[#3498DB] font-medium hover:underline">Detaylı Bilgi →</a>
              </div>
            </div>
            
            {/* Danışmanlık Hizmetleri */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full bg-[#3498DB] flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-center text-[#2C3E50] mb-4">Danışmanlık Hizmetleri</h3>
              <p className="text-[#7F8C8D] text-center mb-6">Gayrimenkul işlemlerinde karşılaşabileceğiniz yasal süreçlerde ve finansal konularda uzman ekibimizle yanınızdayız.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#3498DB] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="text-[#7F8C8D]">Hukuki Danışmanlık</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#3498DB] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="text-[#7F8C8D]">Finansal Danışmanlık</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#3498DB] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="text-[#7F8C8D]">Yatırım Danışmanlığı</span>
                </li>
              </ul>
              <div className="text-center">
                <a href="#" className="text-[#3498DB] font-medium hover:underline">Detaylı Bilgi →</a>
              </div>
            </div>
          </div>
          
          {/* Özel Hizmetler */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Ücretsiz Değerleme */}
            <div className="bg-gradient-to-br from-[#3498DB] to-[#2980B9] text-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Ücretsiz Değerleme</h3>
              <p className="mb-6">Ev satmak veya kiralamak mı istiyorsunuz? Profesyonel ekibimizle gayrimenkulünüzün piyasa değerini ücretsiz öğrenin.</p>
              <a href="#" className="inline-block bg-white text-[#3498DB] font-semibold py-3 px-6 rounded-lg shadow hover:shadow-md transition-shadow">Hemen Başvurun</a>
            </div>
            
            {/* Ücretsiz Danışmanlık */}
            <div className="bg-gradient-to-br from-[#2C3E50] to-[#34495E] text-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Ücretsiz Danışmanlık</h3>
              <p className="mb-6">Gayrimenkul almak, satmak veya kiralamak ile ilgili tüm sorularınız için ücretsiz danışmanlık hizmetimizden faydalanın.</p>
              <a href="#" className="inline-block bg-white text-[#2C3E50] font-semibold py-3 px-6 rounded-lg shadow hover:shadow-md transition-shadow">Randevu Alın</a>
            </div>
          </div>
        </div>
      </section>
      
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
