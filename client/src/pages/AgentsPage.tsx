import { useQuery } from "@tanstack/react-query";
import { Phone, Mail, User, MessageCircle } from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";
import { type User as UserType } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type Agent = Omit<UserType, "password">;

const AgentsPage = () => {
  const { data, isLoading, error } = useQuery<{ success: boolean, agents: Agent[] }>({
    queryKey: ["/api/agents"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    refetchOnMount: true,
    staleTime: 0,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Danışmanlarımız</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="shadow-md">
              <CardContent className="p-0">
                <div className="animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data || !data.agents || data.agents.length === 0) {
    console.log("AgentsPage: Veri alınamadı veya boş", { error, data });
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-center mb-8">Danışmanlarımız</h1>
        <p className="text-gray-500 mb-8">Danışman bilgileri yüklenirken bir sorun oluştu.</p>
        <Link href="/">
          <Button>Ana Sayfaya Dön</Button>
        </Link>
      </div>
    );
  }
  
  console.log("Danışmanlar yüklendi:", data.agents);

  return (
    <div className="bg-gradient-to-b from-[#f2f9ff] to-white py-16">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#1a5f89] to-[#2980B9] text-transparent bg-clip-text leading-tight">
            Danışmanlarımız
          </h1>
          <p className="text-lg md:text-xl text-[#5a6a6e] leading-relaxed">
            Profesyonel emlak danışmanlarımızla tanışın. Sektördeki en iyi uzmanlarla çalışıyoruz.
            Size en doğru gayrimenkul çözümlerini sunmak için buradayız.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 z-10"></div>
                    {agent.avatarUrl ? (
                      <img 
                        src={agent.avatarUrl} 
                        alt={agent.fullName} 
                        className="w-full h-64 object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center">
                        <User className="h-24 w-24 text-blue-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-8 bg-white">
                    <h3 className="text-xl font-bold mb-2 text-[#2C3E50]">{agent.fullName}</h3>
                    <p className="text-[#3498DB] font-medium mb-4">Emlak Danışmanı</p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-blue-50 mr-3">
                          <Phone className="h-4 w-4 text-[#3498DB]" />
                        </div>
                        <span className="text-gray-600 text-sm">{agent.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-blue-50 mr-3">
                          <Mail className="h-4 w-4 text-[#3498DB]" />
                        </div>
                        <span className="text-gray-600 text-sm">{agent.email}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Link href="/contact">
                        <Button variant="default" className="w-full bg-gradient-to-r from-[#2980B9] to-[#3498DB] hover:from-[#2573a7] hover:to-[#2980B9] text-white shadow-md hover:shadow-lg transition-all duration-300">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          İletişime Geç
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* İş Birliği CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-20 bg-gradient-to-r from-[#3498DB] to-[#2980B9] rounded-xl p-10 text-white shadow-xl max-w-5xl mx-auto backdrop-blur-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Ekibimize Katılın</h2>
              <p className="mb-6 opacity-90">
                Siz de Co Worker ailesinin bir parçası olun! Profesyonel danışman kadromuza katılarak kariyerinizi ileriye taşıyın.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <div className="mr-3 mt-1 bg-white/20 p-1 rounded">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="opacity-90">Kapsamlı eğitim ve geliştirme programları</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 bg-white/20 p-1 rounded">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="opacity-90">Rekabetçi komisyon oranları ve ek kazanç fırsatları</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 bg-white/20 p-1 rounded">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="opacity-90">Teknoloji destekli CRM ve pazarlama araçları</span>
                </li>
              </ul>
            </div>
            <div className="flex justify-center md:justify-end">
              <Link href="/contact">
                <Button className="bg-white text-[#3498DB] hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                  Kariyer Fırsatları
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export { AgentsPage };