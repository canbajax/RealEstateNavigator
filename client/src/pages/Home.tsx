import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import PropertyTypes from "@/components/PropertyTypes";
import OurAgents from "@/components/OurAgents";
import ContactForm from "@/components/ContactForm";
import { MapPin, PhoneCall, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { ContactInfo } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

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
              Güçlü kurumsal iş ortaklıklarımız ve geniş uzman danışman ağımız ile emlak sektörünün tüm ihtiyaçlarına yönelik kusursuz hizmetler sunuyoruz.
            </p>
          </div>
          
          {/* Sayılarla Co Worker */}
          <div className="bg-white rounded-xl shadow-xl p-8 mb-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <motion.div 
                className="p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3498DB] to-[#5DADE2] mb-2">Güçlü</div>
                <div className="text-sm md:text-base text-[#7F8C8D]">Kurumsal İş Ortaklığı</div>
              </motion.div>
              <motion.div 
                className="p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3498DB] to-[#5DADE2] mb-2">Uzman</div>
                <div className="text-sm md:text-base text-[#7F8C8D]">Sektör Profesyonelleri</div>
              </motion.div>
              <motion.div 
                className="p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3498DB] to-[#5DADE2] mb-2">Yüksek</div>
                <div className="text-sm md:text-base text-[#7F8C8D]">İşlem Hacmi</div>
              </motion.div>
              <motion.div 
                className="p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3498DB] to-[#5DADE2] mb-2">Tam</div>
                <div className="text-sm md:text-base text-[#7F8C8D]">Müşteri Memnuniyeti</div>
              </motion.div>
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
                  <span className="text-[#7F8C8D]">Yüksek Doğruluk Oranı</span>
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
                  <Link href="/contact">
                    <a className="inline-block bg-white text-[#3498DB] font-semibold py-3 px-6 rounded-lg shadow hover:shadow-md transition-shadow">Hemen Başvurun</a>
                  </Link>
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
                      <span className="opacity-90">Toplu Satış ve Kiralama</span>
                    </li>
                    <li className="flex items-center">
                      <div className="mr-3 bg-white/20 p-1 rounded">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="opacity-90">Proje Tanıtım ve Pazarlama</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <Link href="/contact">
                    <a className="inline-block bg-white text-[#2C3E50] font-semibold py-3 px-6 rounded-lg shadow hover:shadow-md transition-shadow">İletişime Geçin</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-[#3498DB] to-[#2980B9] text-white rounded-xl p-8 shadow-xl max-w-4xl w-full">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                <div className="md:col-span-3">
                  <h3 className="text-2xl font-bold mb-4">Ücretsiz Gayrimenkul Değerleme</h3>
                  <p className="mb-4 md:mb-0 opacity-90">Gayrimenkulünüzün güncel piyasa değerini öğrenmek için hemen başvurun. Uzman ekibimiz en kısa sürede size ulaşsın.</p>
                </div>
                <div className="md:col-span-2 flex justify-center md:justify-end">
                  <Link href="/contact">
                    <a className="inline-block bg-white text-[#3498DB] hover:text-[#5DADE2] font-semibold py-3 px-6 rounded-lg shadow hover:shadow-md transition-shadow">
                      Ücretsiz Değerleme Alın
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <FeaturedProperties />
      
      <PropertyTypes />
      
      <OurAgents />
      
      {/* İletişim Bölümü */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="lg:w-1/2">
              <ContactForm />
            </div>
            
            <div className="lg:w-1/2">
              <div className="bg-white p-8 rounded-xl shadow-lg h-full">
                <h2 className="text-3xl font-bold text-[#2C3E50] mb-6">İletişim Bilgilerimiz</h2>
                <p className="text-[#7F8C8D] mb-8">Gayrimenkul ihtiyaçlarınız için bizimle iletişime geçin. Uzman ekibimiz size yardımcı olmak için hazır.</p>
                
                {isLoading ? (
                  <>
                    <div className="flex items-start mb-6">
                      <div className="mr-4 mt-1">
                        <MapPin className="h-6 w-6 text-[#3498DB]" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-4 w-64" />
                      </div>
                    </div>
                    
                    <div className="flex items-start mb-6">
                      <div className="mr-4 mt-1">
                        <PhoneCall className="h-6 w-6 text-[#3498DB]" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-40 mb-2" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                    
                    <div className="flex items-start mb-8">
                      <div className="mr-4 mt-1">
                        <Mail className="h-6 w-6 text-[#3498DB]" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start mb-6">
                      <div className="mr-4 mt-1">
                        <MapPin className="h-6 w-6 text-[#3498DB]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#2C3E50] mb-1">Adres</h4>
                        <p className="text-[#7F8C8D]">{contactInfo?.address || "Adres bilgisi bulunamadı"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start mb-6">
                      <div className="mr-4 mt-1">
                        <PhoneCall className="h-6 w-6 text-[#3498DB]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#2C3E50] mb-1">Telefon</h4>
                        <p className="text-[#7F8C8D]">{contactInfo?.phone || "Telefon bilgisi bulunamadı"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start mb-8">
                      <div className="mr-4 mt-1">
                        <Mail className="h-6 w-6 text-[#3498DB]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#2C3E50] mb-1">E-posta</h4>
                        <p className="text-[#7F8C8D]">{contactInfo?.email || "E-posta bilgisi bulunamadı"}</p>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="flex space-x-4">
                  <a href={contactInfo?.facebook || "#"} className="bg-[#EBF5FB] p-3 rounded-full hover:bg-[#D6EAF8] transition-colors">
                    <Facebook className="h-5 w-5 text-[#3498DB]" />
                  </a>
                  <a href={contactInfo?.twitter || "#"} className="bg-[#EBF5FB] p-3 rounded-full hover:bg-[#D6EAF8] transition-colors">
                    <Twitter className="h-5 w-5 text-[#3498DB]" />
                  </a>
                  <a href={contactInfo?.instagram || "#"} className="bg-[#EBF5FB] p-3 rounded-full hover:bg-[#D6EAF8] transition-colors">
                    <Instagram className="h-5 w-5 text-[#3498DB]" />
                  </a>
                  <a href={contactInfo?.linkedin || "#"} className="bg-[#EBF5FB] p-3 rounded-full hover:bg-[#D6EAF8] transition-colors">
                    <Linkedin className="h-5 w-5 text-[#3498DB]" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;