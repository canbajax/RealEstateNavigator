import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertContactMessageSchema } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Extend the schema with custom validation
const formSchema = insertContactMessageSchema.extend({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
});

type FormValues = z.infer<typeof formSchema>;

const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "Satış Hakkında",
      message: "",
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (data: FormValues) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: async () => {
      toast({
        title: "Başarılı!",
        description: "Mesajınız başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.",
        variant: "default",
      });
      form.reset();
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast({
        title: "Hata!",
        description: "Mesajınız gönderilirken bir sorun oluştu. Lütfen tekrar deneyiniz.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      console.error("Error sending message:", error);
    },
  });

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    mutate(data);
  };

  return (
    <div className="bg-white text-[#2C3E50] rounded-lg p-6 md:p-8">
      <h3 className="font-semibold text-xl mb-6">Bize Mesaj Gönderin</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#7F8C8D]">Adınız</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="w-full px-4 py-3 border border-[#BDC3C7] rounded-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#7F8C8D]">E-posta Adresiniz</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="email" 
                      className="w-full px-4 py-3 border border-[#BDC3C7] rounded-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-[#7F8C8D]">Telefon Numaranız</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="tel" 
                    className="w-full px-4 py-3 border border-[#BDC3C7] rounded-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-[#7F8C8D]">Konu</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full px-4 py-3 border border-[#BDC3C7] rounded-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]">
                      <SelectValue placeholder="Konu seçiniz" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Satış Hakkında">Satış Hakkında</SelectItem>
                    <SelectItem value="Kiralama Hakkında">Kiralama Hakkında</SelectItem>
                    <SelectItem value="Emlak Değerleme">Emlak Değerleme</SelectItem>
                    <SelectItem value="Danışmanlık">Danışmanlık</SelectItem>
                    <SelectItem value="Diğer">Diğer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-[#7F8C8D]">Mesajınız</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    rows={4} 
                    className="w-full px-4 py-3 border border-[#BDC3C7] rounded-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#3498DB] hover:bg-[#5DADE2] text-white font-medium px-6 py-3 rounded-md transition"
          >
            {isSubmitting ? "Gönderiliyor..." : "Mesaj Gönder"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;
