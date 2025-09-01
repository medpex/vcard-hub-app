import { useParams } from "react-router-dom";
import { BusinessCard } from "@/components/BusinessCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Share2, Phone, Mail, MapPin, Globe, Linkedin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - enhanced with additional fields
const mockCardData = {
  id: "1",
  name: "Max Mustermann",
  position: "Geschäftsführer",
  company: "Stadtwerke Geesthacht",
  email: "max.mustermann@stadtwerke-geesthacht.de",
  phone: "+49 4152 123456",
  whatsapp: "+49 152 987654321",
  address: "Bergedorfer Straße 2, 21502 Geesthacht",
  website: "www.stadtwerke-geesthacht.de",
  linkedin: "linkedin.com/in/max-mustermann",
  instagram: "maxmustermann_official",
  bio: "Leidenschaftlicher Führungskraft mit über 15 Jahren Erfahrung in der Energiebranche. Fokus auf nachhaltige Energielösungen und Kundenzufriedenheit.",
  avatar: "/lovable-uploads/c2132334-c633-4c02-af9f-2f9aa45da5dd.png"
};

export default function BusinessCardView() {
  const { id } = useParams();
  const { toast } = useToast();

  const handleSaveContact = () => {
    // Generate vCard data
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${mockCardData.name}
ORG:${mockCardData.company}
TITLE:${mockCardData.position}
EMAIL:${mockCardData.email}
TEL:${mockCardData.phone}
TEL;TYPE=cell:${mockCardData.whatsapp}
ADR:;;${mockCardData.address};;;;
URL:${mockCardData.website}
NOTE:${mockCardData.bio}
END:VCARD`;

    // Create and download vCard file
    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${mockCardData.name.replace(/\s+/g, '_')}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Kontakt gespeichert",
      description: "Die vCard wurde heruntergeladen.",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${mockCardData.name} - ${mockCardData.position}`,
          text: `Digitale Visitenkarte von ${mockCardData.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Sharing cancelled');
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link kopiert",
        description: "Der Link zur Visitenkarte wurde in die Zwischenablage kopiert.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-business-secondary via-background to-business-secondary/50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Main Business Card Display - Better container */}
          <div className="flex justify-center px-2 sm:px-4">
            <div className="w-full max-w-sm">
              <BusinessCard data={mockCardData} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
            <Button onClick={handleSaveContact} className="gap-2 w-full sm:w-auto">
              <Download className="w-4 h-4" />
              Kontakt speichern
            </Button>
            <Button variant="outline" onClick={handleShare} className="gap-2 w-full sm:w-auto">
              <Share2 className="w-4 h-4" />
              Teilen
            </Button>
          </div>

          {/* Contact Details Card */}
          <Card className="mx-4 sm:max-w-2xl sm:mx-auto">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="text-center border-b pb-4">
                  <h1 className="text-xl sm:text-2xl font-bold text-business-text">{mockCardData.name}</h1>
                  <p className="text-base sm:text-lg text-business-primary font-medium">{mockCardData.position}</p>
                  <p className="text-sm sm:text-base text-muted-foreground">{mockCardData.company}</p>
                </div>

                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                  {/* Email */}
                  <a 
                    href={`mailto:${mockCardData.email}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group touch-manipulation"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-business-primary/10 flex items-center justify-center group-hover:bg-business-primary/20 transition-colors flex-shrink-0">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-business-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm sm:text-base">E-Mail</p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{mockCardData.email}</p>
                    </div>
                  </a>

                  {/* Phone */}
                  <a 
                    href={`tel:${mockCardData.phone}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group touch-manipulation"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-business-primary/10 flex items-center justify-center group-hover:bg-business-primary/20 transition-colors flex-shrink-0">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-business-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm sm:text-base">Telefon</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{mockCardData.phone}</p>
                    </div>
                  </a>

                  {/* Website */}
                  {mockCardData.website && (
                    <a 
                      href={`https://${mockCardData.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group touch-manipulation"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-business-primary/10 flex items-center justify-center group-hover:bg-business-primary/20 transition-colors flex-shrink-0">
                        <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-business-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base">Website</p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{mockCardData.website}</p>
                      </div>
                    </a>
                  )}

                  {/* LinkedIn */}
                  {mockCardData.linkedin && (
                    <a 
                      href={`https://${mockCardData.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group touch-manipulation"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-business-primary/10 flex items-center justify-center group-hover:bg-business-primary/20 transition-colors flex-shrink-0">
                        <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-business-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base">LinkedIn</p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{mockCardData.linkedin}</p>
                      </div>
                    </a>
                  )}
                </div>

                {/* Address */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-business-primary/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-business-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base">Adresse</p>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{mockCardData.address}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-xs sm:text-sm text-muted-foreground px-4">
            <p>Digitale Visitenkarte • Powered by {mockCardData.company}</p>
          </div>
        </div>
      </div>
    </div>
  );
}