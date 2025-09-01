import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";
import { Card } from "@/components/ui/card";

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
  avatar?: string;
  companyLogo?: string;
}

interface BusinessCardProps {
  data: BusinessCardData;
  variant?: "preview" | "display";
  className?: string;
}

export function BusinessCard({ data, variant = "display", className = "" }: BusinessCardProps) {
  const cardSize = variant === "preview" 
    ? "w-80 h-48 md:w-80 md:h-48" 
    : "w-full max-w-sm mx-auto h-56 sm:w-96 sm:h-56 md:max-w-md lg:max-w-lg";
  
  return (
    <Card className={`
      ${cardSize} relative overflow-hidden business-card-shadow 
      border-0 ${className}
    `}>
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-business" />
      
      {/* Content overlay */}
      <div className="relative h-full p-4 sm:p-6 text-white flex flex-col justify-between">
        {/* Header */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold mb-1 truncate">{data.name}</h2>
            <p className="text-blue-100 text-xs sm:text-sm font-medium mb-1 sm:mb-2 truncate">{data.position}</p>
            <p className="text-blue-50 text-xs sm:text-sm truncate">{data.company}</p>
          </div>
          
          {/* Avatar/Logo area */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {data.avatar && (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                <img 
                  src={data.avatar} 
                  alt={data.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                />
              </div>
            )}
            {data.companyLogo && (
              <div className="w-12 h-6 sm:w-16 sm:h-8 bg-white/10 backdrop-blur-sm rounded border border-white/20 flex items-center justify-center">
                <img 
                  src={data.companyLogo} 
                  alt={data.company}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Contact information */}
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-blue-200 flex-shrink-0" />
            <span className="text-blue-50 truncate">{data.email}</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-blue-200 flex-shrink-0" />
            <span className="text-blue-50">{data.phone}</span>
          </div>
          
          {data.website && (
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-blue-200 flex-shrink-0" />
              <span className="text-blue-50 truncate">{data.website}</span>
            </div>
          )}
          
          {data.linkedin && (
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Linkedin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-200 flex-shrink-0" />
              <span className="text-blue-50 truncate">{data.linkedin}</span>
            </div>
          )}
        </div>
        
        {/* Address at bottom */}
        <div className="flex items-start gap-2 text-xs pt-2 border-t border-white/20">
          <MapPin className="w-3 h-3 text-blue-200 flex-shrink-0 mt-0.5" />
          <span className="text-blue-50 leading-tight">{data.address}</span>
        </div>
      </div>
    </Card>
  );
}