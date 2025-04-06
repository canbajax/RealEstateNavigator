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
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-[#3498DB] tracking-wider uppercase mb-2 inline-block">HİZMETLERİMİZ</span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#2C3E50] mb-6">Co Worker ile Emlak Dünyasında <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3498DB] to-[#5DADE2]">Profesyonel Çözümler</span></h2>
            <p className="text-[#7F8C8D] max-w-3xl mx-auto text-lg">
              700+ kurumsal iş ortağımız ve 15.000+ sektör profesyonelimiz ile emlak sektörünün tüm ihtiyaçlarına yönelik kusursuz hizmetler sunuyoruz.
            </p>
          </div>
          
          {/* Sayılarla Co Worker */}
          <div className="bg-white rounded-xl shadow-xl p-8 mb-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="p-4">
                <div className="text-4xl md:text-5xl font-bold text-[#3498DB] mb-2">700+</div>
                <div className="text-sm md:text-base text-[#7F8C8D]">Kurumsal İş Ortağı</div>
              </div>
              <div className="p-4">
                <div className="text-4xl md:text-5xl font-bold text-[#3498DB] mb-2">15K+</div>
                <div className="text-sm md:text-base text-[#7F8C8D]">Sektör Profesyoneli</div>
              </div>
              <div className="p-4">
                <div className="text-4xl md:text-5xl font-bold text-[#3498DB] mb-2">120B+</div>
                <div className="text-sm md:text-base text-[#7F8C8D]">Tamamlanan İşlem</div>
              </div>
              <div className="p-4">
                <div className="text-4xl md:text-5xl font-bold text-[#3498DB] mb-2">%98</div>
                <div className="text-sm md:text-base text-[#7F8C8D]">Müşteri Memnuniyeti</div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Gayrimenkul Değerleme Hizmeti */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-t-4 border-[#3498DB]">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#3498DB] to-[#5DADE2] flex items-center justify-center mb-6 mx-auto shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path><path d="M2 7h20"></path><path d="M22 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"></path><path d="M6 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"></path><path d="M14 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-center text-[#2C3E50] mb-4">Premium Değerleme Hizmetleri</h3>
              <p className="text-[#7F8C8D] text-center mb-6">Yapay zeka destekli değerleme teknolojimiz ve uzman kadromuz ile gayrimenkulünüzün gerçek piyasa değerini dakikalar içinde öğrenin.</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <div className="mr-3 bg-[#EBF5FB] p-1 rounded">
                    <svg className="w-5 h-5 text-[#3498DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-[#7F8C8D]">Yapay Zeka Destekli Analiz</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 bg-[#EBF5FB] p-1 rounded">
                    <svg className="w-5 h-5 text-[#3498DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-[#7F8C8D]">%99 Doğruluk Oranı</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 bg-[#EBF5FB] p-1 rounded">
                    <svg className="w-5 h-5 text-[#3498DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-[#7F8C8D]">Raporlama ve Trend Analizi</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 bg-[#EBF5FB] p-1 rounded">
                    <svg className="w-5 h-5 text-[#3498DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-[#7F8C8D]">SPK Lisanslı Değerleme</span>
                </li>
              </ul>
              <div className="text-center">
                <a href="#" className="inline-flex items-center text-[#3498DB] font-medium hover:text-[#5DADE2] transition-colors">
                  <span>Detaylı Bilgi</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Satış ve Kiralama Süreç Desteği */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-t-4 border-[#3498DB]">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#3498DB] to-[#5DADE2] flex items-center justify-center mb-6 mx-auto shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M18 8a6 6 0 0 0-6-6 6 6 0 0 0-6 6c0 6 6 10 6 10s6-4 6-10"></path><circle cx="12" cy="8" r="2"></circle></svg>
              </div>
              <h3 className="text-xl font-bold text-center text-[#2C3E50] mb-4">360° Emlak Yönetimi</h3>
              <p className="text-[#7F8C8D] text-center mb-6">A'dan Z'ye tüm gayrimenkul süreçlerini yönetiyoruz. Satış, kiralama ve yönetimde uzman kadromuzla yanınızdayız.</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <div className="mr-3 bg-[#EBF5FB] p-1 rounded">
                    <svg className="w-5 h-5 text-[#3498DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-[#7F8C8D]">Premium İlan Yönetimi</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 bg-[#EBF5FB] p-1 rounded">
                    <svg className="w-5 h-5 text-[#3498DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-[#7F8C8D]">Profesyonel Fotoğraf ve Video</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 bg-[#EBF5FB] p-1 rounded">
                    <svg className="w-5 h-5 text-[#3498DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-[#7F8C8D]">Pazarlama ve Tanıtım Desteği</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 bg-[#EBF5FB] p-1 rounded">
                    <svg className="w-5 h-5 text-[#3498DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-[#7F8C8D]">7/24 Müşteri Hizmetleri</span>
                </li>
              </ul>
              <div className="text-center">
                <a href="#" className="inline-flex items-center text-[#3498DB] font-medium hover:text-[#5DADE2] transition-colors">
                  <span>Detaylı Bilgi</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Danışmanlık Hizmetleri */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-t-4 border-[#3498DB]">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#3498DB] to-[#5DADE2] flex items-center justify-center mb-6 mx-auto shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-center text-[#2C3E50] mb-4">Yatırım Danışmanlığı</h3>
              <p className="text-[#7F8C8D] text-center mb-6">Uzman ekibimiz ile gayrimenkul yatırımlarınızı en üst düzeye çıkarın. Piyasa trendlerini ve yatırım fırsatlarını analiz ediyoruz.</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <div className="mr-3 bg-[#EBF5FB] p-1 rounded">
                    <svg className="w-5 h-5 text-[#3498DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-[#7F8C8D]">Portföy Yönetimi</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 bg-[#EBF5FB] p-1 rounded">
                    <svg className="w-5 h-5 text-[#3498DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-[#7F8C8D]">Gelir-Gider Analizi</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 bg-[#EBF5FB] p-1 rounded">
                    <svg className="w-5 h-5 text-[#3498DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-[#7F8C8D]">Vergi ve Finansal Planlama</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 bg-[#EBF5FB] p-1 rounded">
                    <svg className="w-5 h-5 text-[#3498DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-[#7F8C8D]">Piyasa Trend Raporları</span>
                </li>
              </ul>
              <div className="text-center">
                <a href="#" className="inline-flex items-center text-[#3498DB] font-medium hover:text-[#5DADE2] transition-colors">
                  <span>Detaylı Bilgi</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Hizmet Adımları */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-[#2C3E50] mb-4">Co Worker ile 4 Adımda Emlak Süreciniz</h3>
              <p className="text-[#7F8C8D] max-w-2xl mx-auto">Emlak işlemlerinizi basitleştiren uçtan uca profesyonel çözümler sunuyoruz.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="relative bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-[#3498DB] text-white flex items-center justify-center text-xl font-bold shadow-lg">1</div>
                <h4 className="text-lg font-semibold text-[#2C3E50] mt-4 mb-3">Ücretsiz Değerleme</h4>
                <p className="text-[#7F8C8D]">Gayrimenkulünüzün gerçek piyasa değerini uzman ekibimizle öğrenin.</p>
              </div>
              
              <div className="relative bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-[#3498DB] text-white flex items-center justify-center text-xl font-bold shadow-lg">2</div>
                <h4 className="text-lg font-semibold text-[#2C3E50] mt-4 mb-3">Profesyonel Tanıtım</h4>
                <p className="text-[#7F8C8D]">Profesyonel fotoğraf, video ve 3D tur ile gayrimenkulünüzü en iyi şekilde tanıtıyoruz.</p>
              </div>
              
              <div className="relative bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-[#3498DB] text-white flex items-center justify-center text-xl font-bold shadow-lg">3</div>
                <h4 className="text-lg font-semibold text-[#2C3E50] mt-4 mb-3">Hedefli Pazarlama</h4>
                <p className="text-[#7F8C8D]">Doğru alıcı veya kiracıya ulaşmak için kapsamlı ve hedefli pazarlama stratejileri uyguluyoruz.</p>
              </div>
              
              <div className="relative bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-[#3498DB] text-white flex items-center justify-center text-xl font-bold shadow-lg">4</div>
                <h4 className="text-lg font-semibold text-[#2C3E50] mt-4 mb-3">Sorunsuz İşlem</h4>
                <p className="text-[#7F8C8D]">Sözleşmeden tapuya kadar tüm yasal süreçlerde size destek oluyoruz.</p>
              </div>
            </div>
          </div>
          
          {/* Kurumsal Müşteriler için Hizmetler */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gradient-to-br from-[#3498DB] to-[#2980B9] text-white rounded-xl p-8 shadow-xl">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Konut Sahipleri İçin</h3>
                  <p className="mb-6 opacity-90">Gayrimenkulünüzü satmak veya kiralamak mı istiyorsunuz? Profesyonel çözümlerimiz ve uzman ekibimizle yanınızdayız.</p>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <div className="mr-3 bg-white/20 p-1 rounded">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="opacity-90">Ücretsiz Değerleme</span>
                    </li>
                    <li className="flex items-center">
                      <div className="mr-3 bg-white/20 p-1 rounded">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="opacity-90">Profesyonel Fotoğraf ve Video</span>
                    </li>
                    <li className="flex items-center">
                      <div className="mr-3 bg-white/20 p-1 rounded">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="opacity-90">Premium İlan Yönetimi</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <a href="#" className="inline-block bg-white text-[#3498DB] font-semibold py-3 px-6 rounded-lg shadow hover:shadow-md transition-shadow">Hemen Başvurun</a>
                </div>
              </div>
            </div>
            
            <div className="bg-[#2C3E50] text-white rounded-xl p-8 shadow-xl">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Kurumsal Müşteriler İçin</h3>
                  <p className="mb-6 opacity-90">İnşaat, gayrimenkul yatırım ve proje geliştirme şirketlerine özel, kurumsal çözümlerimizden faydalanın.</p>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <div className="mr-3 bg-white/20 p-1 rounded">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="opacity-90">Piyasa Araştırma Raporları</span>
                    </li>
                    <li className="flex items-center">
                      <div className="mr-3 bg-white/20 p-1 rounded">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="opacity-90">Proje Pazarlama Desteği</span>
                    </li>
                    <li className="flex items-center">
                      <div className="mr-3 bg-white/20 p-1 rounded">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="opacity-90">Portföy Yönetimi</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <a href="#" className="inline-block bg-[#3498DB] text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-[#5DADE2] transition-colors">Kurumsal Paketler</a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Neden Biz Hizmet Özelliklerimiz */}
          <div className="bg-white rounded-xl shadow-xl p-8 mb-16">
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold text-[#2C3E50] mb-4">Neden Co Worker?</h3>
              <p className="text-[#7F8C8D] max-w-2xl mx-auto">Türkiye'nin en güvenilir ve kapsamlı emlak platformu olarak müşterilerimize sunduğumuz avantajlar.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#EBF5FB] flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3498DB]"><path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1M8 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M8 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 0h2a2 2 0 0 1 2 2v3m2 4H10m0 0 3-3m-3 3 3 3"></path></svg>
                </div>
                <h4 className="text-lg font-semibold text-[#2C3E50] mb-2">Şeffaf Süreçler</h4>
                <p className="text-center text-[#7F8C8D]">Her aşamada bilgilendirme ve şeffaf iletişim ile güven sağlıyoruz.</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#EBF5FB] flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3498DB]"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                </div>
                <h4 className="text-lg font-semibold text-[#2C3E50] mb-2">Uzman Kadro</h4>
                <p className="text-center text-[#7F8C8D]">Sektörün en deneyimli profesyonelleri ile hizmet veriyoruz.</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#EBF5FB] flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3498DB]"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <h4 className="text-lg font-semibold text-[#2C3E50] mb-2">Güvenilir Hizmet</h4>
                <p className="text-center text-[#7F8C8D]">%98 müşteri memnuniyeti ile sektörün en güvenilir markasıyız.</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#EBF5FB] flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3498DB]"><path d="M12 16a4 4 0 0 0 0-8"></path><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="M20 12h2"></path><path d="M2 12h2"></path><path d="M19.07 5 17.66 6.39"></path><path d="M6.34 17.66 4.93 19.07"></path></svg>
                </div>
                <h4 className="text-lg font-semibold text-[#2C3E50] mb-2">Teknoloji Odaklı</h4>
                <p className="text-center text-[#7F8C8D]">En yenilikçi teknolojileri kullanarak hizmet kalitemizi sürekli geliştiriyoruz.</p>
              </div>
            </div>
          </div>
          
          {/* Ücretsiz Değerleme CTA */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-[#3498DB] to-[#2980B9] text-white rounded-xl p-8 shadow-xl max-w-4xl w-full">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                <div className="md:col-span-3">
                  <h3 className="text-2xl font-bold mb-4">Ücretsiz Gayrimenkul Değerleme</h3>
                  <p className="mb-4 md:mb-0 opacity-90">Gayrimenkulünüzün güncel piyasa değerini öğrenmek için hemen başvurun. Uzman ekibimiz en kısa sürede size ulaşsın.</p>
                </div>
                <div className="md:col-span-2 flex justify-center md:justify-end">
                  <a href="#" className="inline-block bg-white text-[#3498DB] hover:text-[#5DADE2] font-semibold py-3 px-6 rounded-lg shadow hover:shadow-md transition-shadow">
                    Ücretsiz Değerleme Alın
                  </a>
                </div>
              </div>
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
