import { Mail, Phone, MapPin, Globe, Linkedin, Instagram, MessageCircle, Calendar, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      relative overflow-hidden bg-white border shadow-xl ${className}
    `}>
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
        <div className="flex items-start gap-4">
          {/* Profile Image */}
          <Avatar className="w-16 h-16 border-2 border-white/30">
            <AvatarImage src={data.avatar} alt={data.name} />
            <AvatarFallback className="bg-white/20 text-white font-semibold">
              {data.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          {/* Basic Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold mb-1">{data.name}</h2>
            <p className="text-blue-100 text-sm mb-1">{data.position}</p>
            <p className="text-blue-50 text-sm">{data.company}</p>
          </div>
          
          {/* Company Logo */}
          {data.companyLogo && (
            <div className="w-12 h-12 bg-white/10 rounded border border-white/20 p-2">
              <img src={data.companyLogo} alt={data.company} className="w-full h-full object-contain" />
            </div>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="p-6 space-y-4">
        {/* Bio */}
        {data.bio && (
          <p className="text-sm text-gray-600 leading-relaxed border-b pb-3">{data.bio}</p>
        )}
        
        {/* Contact Grid */}
        <div className="grid grid-cols-1 gap-3">
          {/* Email */}
          <a 
            href={`mailto:${data.email}`}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
              <Mail className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 uppercase tracking-wide">E-Mail</p>
              <p className="text-sm font-medium text-gray-900 truncate">{data.email}</p>
            </div>
          </a>

          {/* Phone */}
          <a 
            href={`tel:${data.phone}`}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
              <Phone className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Telefon</p>
              <p className="text-sm font-medium text-gray-900">{data.phone}</p>
            </div>
          </a>

          {/* WhatsApp */}
          {data.whatsapp && (
            <a 
              href={`https://wa.me/${data.whatsapp.replace(/[^\d]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide">WhatsApp</p>
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
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center">
                <Globe className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Website</p>
                <p className="text-sm font-medium text-gray-900 truncate">{data.website}</p>
              </div>
            </a>
          )}
        </div>

        {/* Social Media Row */}
        <div className="flex gap-2 pt-3 border-t">
          {data.linkedin && (
            <a 
              href={`https://${data.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors"
            >
              <Linkedin className="w-4 h-4 text-blue-600" />
            </a>
          )}
          
          {data.instagram && (
            <a 
              href={`https://instagram.com/${data.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-pink-50 rounded-full flex items-center justify-center hover:bg-pink-100 transition-colors"
            >
              <Instagram className="w-4 h-4 text-pink-600" />
            </a>
          )}
          
          <div className="flex-1"></div>
          
          {/* Address Badge */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            <span className="truncate max-w-32">{data.address.split(',')[0]}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}