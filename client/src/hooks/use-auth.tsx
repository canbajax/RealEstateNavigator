import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User as SelectUser, InsertUser } from "@shared/schema";
import { apiRequest, getQueryFn, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<{ success: boolean; user: Omit<SelectUser, "password"> }, Error, LoginData>;
  logoutMutation: UseMutationResult<{ success: boolean; message: string }, Error, void>;
  registerMutation: UseMutationResult<{ success: boolean; user: Omit<SelectUser, "password"> }, Error, InsertUser>;
};

type LoginData = Pick<InsertUser, "username" | "password">;

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  const {
    data: userData,
    error,
    isLoading,
  } = useQuery<{ success: boolean; user: SelectUser } | undefined, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Giriş başarısız");
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/user"], data);
      // Sitedeki tüm veri sorgularını yenile
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings/contact-info"] });
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings/working-hours"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/featured-listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/property-types"] });
      toast({
        title: "Giriş başarılı",
        description: "Hesabınıza başarıyla giriş yaptınız.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Giriş başarısız",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: InsertUser) => {
      const res = await apiRequest("POST", "/api/register", userData);
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Kayıt başarısız");
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/user"], data);
      toast({
        title: "Kayıt başarılı",
        description: "Hesabınız başarıyla oluşturuldu ve giriş yapıldı.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Kayıt başarısız",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/logout");
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Çıkış başarısız");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], undefined);
      toast({
        title: "Çıkış başarılı",
        description: "Hesabınızdan başarıyla çıkış yaptınız.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Çıkış başarısız",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: userData?.user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}