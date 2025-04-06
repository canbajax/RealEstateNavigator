import { MapPin, PhoneCall, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import ContactForm from "@/components/ContactForm";

const Contact = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Page Header */}
      <div className="bg-[#2C3E50] py-12 px-4 sm:px-6 lg:px-8 text-white">
        <div className="container mx-auto">
          <h1 className="font-bold text-3xl md:text-4xl mb-2">Bize Ulaşın</h1>
          <p className="text-lg opacity-90">Sorularınız için bizimle iletişime geçebilirsiniz</p>
        </div>
      </div>

      {/* Contact Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              {/* Contact Info */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="font-bold text-2xl text-[#2C3E50] mb-6">İletişim Bilgilerimiz</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="text-[#3498DB] p-3 bg-[#ECF0F1] rounded-full mr-4">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Adres</h3>
                      <p className="text-[#7F8C8D] mt-1">Bağdat Caddesi No:123, Kadıköy, İstanbul</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-[#3498DB] p-3 bg-[#ECF0F1] rounded-full mr-4">
                      <PhoneCall size={24} />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Telefon</h3>
                      <p className="text-[#7F8C8D] mt-1">+90 (212) 123 45 67</p>
                      <p className="text-[#7F8C8D]">+90 (212) 456 78 90</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-[#3498DB] p-3 bg-[#ECF0F1] rounded-full mr-4">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">E-posta</h3>
                      <p className="text-[#7F8C8D] mt-1">info@emlakcompass.com</p>
                      <p className="text-[#7F8C8D]">satis@emlakcompass.com</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Opening Hours */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="font-bold text-xl text-[#2C3E50] mb-4">Çalışma Saatleri</h2>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-[#7F8C8D]">Pazartesi - Cuma</p>
                    <p className="font-medium">09:00 - 18:00</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-[#7F8C8D]">Cumartesi</p>
                    <p className="font-medium">10:00 - 14:00</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-[#7F8C8D]">Pazar</p>
                    <p className="font-medium">Kapalı</p>
                  </div>
                </div>
              </div>
              
              {/* Social Media */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="font-bold text-xl text-[#2C3E50] mb-4">Sosyal Medya</h2>
                
                <div className="flex space-x-4">
                  <a 
                    href="#" 
                    className="bg-[#3498DB] hover:bg-[#5DADE2] text-white p-3 rounded-full transition"
                    aria-label="Facebook"
                  >
                    <Facebook size={20} />
                  </a>
                  <a 
                    href="#" 
                    className="bg-[#3498DB] hover:bg-[#5DADE2] text-white p-3 rounded-full transition"
                    aria-label="Twitter"
                  >
                    <Twitter size={20} />
                  </a>
                  <a 
                    href="#" 
                    className="bg-[#3498DB] hover:bg-[#5DADE2] text-white p-3 rounded-full transition"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                  <a 
                    href="#" 
                    className="bg-[#3498DB] hover:bg-[#5DADE2] text-white p-3 rounded-full transition"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={20} />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="font-bold text-2xl text-[#2C3E50] mb-6">Bize Mesaj Gönderin</h2>
              <p className="text-[#7F8C8D] mb-6">
                Emlak danışmanlarımız size yardımcı olmak için hazır. Sorularınız için bize 
                ulaşabilir veya ücretsiz danışmanlık hizmeti alabilirsiniz.
              </p>
              
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
      
      {/* Map */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <h2 className="font-bold text-2xl text-[#2C3E50] mb-6 text-center">Bizi Ziyaret Edin</h2>
          
          <div className="h-96 bg-[#ECF0F1] rounded-lg flex items-center justify-center">
            <p className="text-[#7F8C8D]">Harita burada gösterilecek</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
