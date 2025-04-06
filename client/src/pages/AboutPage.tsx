import React from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Mail, Clock, Building } from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const AboutPage = () => {
  const { data, isLoading, error } = useQuery<{ success: boolean; contactInfo: any }>({
    queryKey: ["/api/site-settings/contact-info"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const contactInfo = data?.contactInfo;

  return (
    <div className="bg-gradient-to-b from-[#fafbfc] to-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#2980B9] to-[#3498DB] text-transparent bg-clip-text">
              Hakkımızda
            </h1>
            <p className="text-lg text-[#7F8C8D] mb-8">
              2005 yılından bu yana gayrimenkul sektöründe güvenilir çözümler sunuyoruz. Profesyonel ekibimizle Türkiye'nin dört bir yanında hizmet veriyoruz.
            </p>
          </motion.div>
          
          {/* Misyon, Vizyon, Değerler */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#3498DB]"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#3498DB] to-[#5DADE2] flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M18 8a6 6 0 0 0-6-6 6 6 0 0 0-6 6c0 6 6 10 6 10s6-4 6-10"></path><circle cx="12" cy="8" r="2"></circle></svg>
              </div>
              <h3 className="text-xl font-bold text-center text-[#2C3E50] mb-4">Misyonumuz</h3>
              <p className="text-[#7F8C8D] text-center">
                Müşterilerimize güvenilir, şeffaf ve profesyonel gayrimenkul hizmetleri sunarak, hayallerindeki yuvaya veya yatırım fırsatlarına ulaşmalarını sağlamak.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#3498DB]"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#3498DB] to-[#5DADE2] flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path><path d="M2 7h20"></path><path d="M22 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"></path><path d="M6 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"></path><path d="M14 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-center text-[#2C3E50] mb-4">Vizyonumuz</h3>
              <p className="text-[#7F8C8D] text-center">
                Gayrimenkul sektöründe teknoloji ve inovasyonun öncüsü olarak, müşteri memnuniyetinde en yüksek standartları belirleyen lider marka olmak.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#3498DB]"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#3498DB] to-[#5DADE2] flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-center text-[#2C3E50] mb-4">Değerlerimiz</h3>
              <p className="text-[#7F8C8D] text-center">
                Dürüstlük, şeffaflık, profesyonellik ve müşteri odaklılık temel değerlerimizdir. Her müşterimize özel çözümler sunuyoruz.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Hizmetlerimiz Section */}
      <section className="py-16 bg-[#f8f9fa]">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold mb-6 text-[#2C3E50]">Hizmetlerimiz</h2>
            <p className="text-[#7F8C8D]">
              A'dan Z'ye tüm gayrimenkul süreçlerinizde yanınızdayız. Profesyonel danışmanlarımız ve teknolojik çözümlerimizle size özel hizmetler sunuyoruz.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-shadow"
            >
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
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-shadow"
            >
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
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-shadow"
            >
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
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Şirket Bilgileri */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2"
            >
              <h2 className="text-3xl font-bold mb-8 text-[#2C3E50]">Şirket Bilgilerimiz</h2>
              <div className="bg-white rounded-xl shadow-lg p-8">
                {isLoading ? (
                  <>
                    <div className="flex items-start mb-6">
                      <div className="mr-4 mt-1">
                        <Building className="h-6 w-6 text-[#3498DB]" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-4 w-64" />
                      </div>
                    </div>
                    
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
                        <Phone className="h-6 w-6 text-[#3498DB]" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-40 mb-2" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                    
                    <div className="flex items-start">
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
                        <Building className="h-6 w-6 text-[#3498DB]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#2C3E50] mb-1">Şirket</h4>
                        <p className="text-[#7F8C8D]">Co Worker Gayrimenkul A.Ş.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start mb-6">
                      <div className="mr-4 mt-1">
                        <MapPin className="h-6 w-6 text-[#3498DB]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#2C3E50] mb-1">Adres</h4>
                        <p className="text-[#7F8C8D]">{contactInfo?.address || "Levent, 34340 Beşiktaş/İstanbul"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start mb-6">
                      <div className="mr-4 mt-1">
                        <Phone className="h-6 w-6 text-[#3498DB]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#2C3E50] mb-1">Telefon</h4>
                        <p className="text-[#7F8C8D]">{contactInfo?.phone || "+90 (212) 123 45 67"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="mr-4 mt-1">
                        <Mail className="h-6 w-6 text-[#3498DB]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#2C3E50] mb-1">E-posta</h4>
                        <p className="text-[#7F8C8D]">{contactInfo?.email || "info@coworker.com.tr"}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="mt-8 bg-gradient-to-r from-[#3498DB] to-[#2980B9] rounded-xl p-8 text-white shadow-lg">
                <h3 className="text-xl font-bold mb-4">Neden Bizi Seçmelisiniz?</h3>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <div className="mr-3 bg-white/20 p-1 rounded">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <span>20 yılı aşkın sektör tecrübesi</span>
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3 bg-white/20 p-1 rounded">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <span>700+ kurumsal iş ortağı</span>
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3 bg-white/20 p-1 rounded">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <span>15.000+ sektör profesyoneli</span>
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3 bg-white/20 p-1 rounded">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <span>Türkiye genelinde 81 ilde hizmet</span>
                  </li>
                </ul>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2"
            >
              <img 
                src="https://images.unsplash.com/photo-1604328698692-f76ea9498e76?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Co Worker Ofis" 
                className="rounded-xl shadow-lg w-full h-[500px] object-cover mb-8"
              />
              
              <div className="bg-[#2C3E50] text-white p-8 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-6">Kurumsal Değerlerimiz</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-[#3498DB]">Güvenilirlik</h4>
                    <p className="text-gray-300 text-sm">
                      Müşterilerimizle kurduğumuz ilişkilerde güven en önemli değerimizdir. Her zaman şeffaf ve dürüst iletişim kurarız.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-[#3498DB]">Uzmanlık</h4>
                    <p className="text-gray-300 text-sm">
                      Sektörün en deneyimli profesyonelleriyle çalışarak müşterilerimize en iyi hizmeti sunuyoruz.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-[#3498DB]">Yenilikçilik</h4>
                    <p className="text-gray-300 text-sm">
                      Teknoloji ve dijital çözümlerle sektöre yön veriyor, sürekli kendimizi yeniliyoruz.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-[#3498DB]">Müşteri Odaklılık</h4>
                    <p className="text-gray-300 text-sm">
                      Her müşterimiz benzersizdir. İhtiyaçlarınıza özel çözümler geliştiriyoruz.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#3498DB] to-[#2980B9] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6">Bizimle Çalışmaya Hazır mısınız?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Gayrimenkul ihtiyaçlarınız için profesyonel ekibimizle hemen iletişime geçin.
              Sizin için en uygun çözümleri birlikte geliştirelim.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-white text-[#3498DB] hover:bg-gray-100 font-medium px-6 py-3 text-base">
                  İletişime Geçin
                </Button>
              </Link>
              <Link href="/agents">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 font-medium px-6 py-3 text-base">
                  Danışmanlarımız
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export { AboutPage };