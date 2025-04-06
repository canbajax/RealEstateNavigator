import { useQuery } from "@tanstack/react-query";
import { Phone, Mail, User } from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";
import { type User as UserType } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";

type Agent = Omit<UserType, "password">;

const OurAgents = () => {
  const { data, isLoading, error } = useQuery<{ success: boolean, agents: Agent[] }>({
    queryKey: ["/api/agents"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    refetchOnMount: true,
    staleTime: 0, // Her zaman yeni veriyi getir
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Danışmanlarımız</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, index) => (
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
    console.log("OurAgents: Veri alınamadı veya boş", { error, data });
    return null;
  }
  
  // Doğrulama amaçlı tüm ajanları loglama
  console.log("Danışmanlar yüklendi:", data.agents);

  return (
    <div className="container mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-12">Danışmanlarımız</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {data.agents.map((agent) => (
          <Card key={agent.id} className="shadow-md overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                {agent.avatarUrl ? (
                  <img 
                    src={agent.avatarUrl} 
                    alt={agent.fullName} 
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                    <User className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{agent.fullName}</h3>
                <p className="text-gray-500 mb-4">Emlak Danışmanı</p>
                
                <div className="space-y-2">
                  {agent.phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-[#3498DB]" />
                      <span>{agent.phone}</span>
                    </div>
                  )}
                  
                  {agent.email && (
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-[#3498DB]" />
                      <span>{agent.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OurAgents;