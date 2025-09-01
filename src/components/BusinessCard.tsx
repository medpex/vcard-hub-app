import { Mail, Phone, MapPin, Globe, Linkedin, Instagram, MessageCircle, ExternalLink, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface BusinessCardData {
  id?: string;
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  linkedin?: string;
  instagram?: string;
  whatsapp?: string;
  avatar?: string;
  companyLogo?: string;
  bio?: string;
}

interface BusinessCardProps {
  data: BusinessCardData;
  variant?: "preview" | "display";
  className?: string;
}

export function BusinessCard({ data, variant = "display", className = "" }: BusinessCardProps) {
  const isPreview = variant === "preview";
  
  return (
    <Card className={`
      ${isPreview ? "w-80 h-48" : "w-full max-w-md mx-auto"} 
      relative overflow-hidden bg-white border-0 shadow-lg ${className}
    `}>
      {/* Header Section - Simplified gradient */}
      <div className="relative bg-gradient-to-r from-business-primary to-business-primary/90 p-4 sm:p-6 text-white">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Profile Image */}
          <Avatar className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-white/20 shadow-lg">
            <AvatarImage src={data.avatar} alt={data.name} />
            <AvatarFallback className="bg-white/10 text-white font-semibold text-sm sm:text-base">
              {data.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          {/* Basic Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold mb-1 truncate">{data.name}</h2>
            <p className="text-white/90 text-sm mb-1 truncate">{data.position}</p>
            <div className="flex items-center gap-1 text-white/80 text-xs sm:text-sm">
              <Building2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{data.company}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information - Streamlined */}
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        {/* Bio - Only on larger screens or if short */}
        {data.bio && !isPreview && (
          <p className="text-sm text-gray-600 leading-relaxed border-b pb-3 line-clamp-2">{data.bio}</p>
        )}
        
        {/* Contact Grid - Icons only on mobile */}
        <div className="grid grid-cols-1 gap-2 sm:gap-3">
          {/* Email */}
          <a 
            href={`mailto:${data.email}`}
            className="flex items-center gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="w-8 h-8 bg-business-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-business-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 uppercase tracking-wide hidden sm:block">E-Mail</p>
              <p className="text-sm font-medium text-gray-900 truncate">{data.email}</p>
            </div>
          </a>

          {/* Phone */}
          <a 
            href={`tel:${data.phone}`}
            className="flex items-center gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="w-8 h-8 bg-business-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4 text-business-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 uppercase tracking-wide hidden sm:block">Telefon</p>
              <p className="text-sm font-medium text-gray-900">{data.phone}</p>
            </div>
          </a>

          {/* WhatsApp - Mobile priority */}
          {data.whatsapp && (
            <a 
              href={`https://wa.me/${data.whatsapp.replace(/[^\d]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide hidden sm:block">WhatsApp</p>
                <p className="text-sm font-medium text-gray-900">{data.whatsapp}</p>
              </div>
            </a>
          )}

          {/* Website */}
          {data.website && (
            <a 
              href={`https://${data.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="w-8 h-8 bg-business-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Globe className="w-4 h-4 text-business-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide hidden sm:block">Website</p>
                <p className="text-sm font-medium text-gray-900 truncate">{data.website}</p>
              </div>
            </a>
          )}
        </div>

        {/* Footer - Social & Location */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {/* Social Media Icons */}
          <div className="flex gap-2">
            {data.linkedin && (
              <a 
                href={`https://${data.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-business-primary/10 rounded-full flex items-center justify-center hover:bg-business-primary/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-business-primary" />
              </a>
            )}
            
            {data.instagram && (
              <a 
                href={`https://instagram.com/${data.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-pink-50 rounded-full flex items-center justify-center hover:bg-pink-100 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-pink-600" />
              </a>
            )}
          </div>
          
          {/* Location Badge */}
          <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate max-w-24 sm:max-w-32">{data.address.split(',')[0]}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}