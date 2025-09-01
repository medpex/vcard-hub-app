import { useParams } from "react-router-dom";
import { BusinessCard } from "@/components/BusinessCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Share2, Phone, Mail, MapPin, Globe, Linkedin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - would come from database in real app
const mockCardData = {
  id: "1",
  name: "Max Mustermann",
  position: "Geschäftsführer",
  company: "Stadtwerke Geesthacht",
  email: "max.mustermann@stadtwerke-geesthacht.de",
  phone: "+49 4152 123456",
  address: "Bergedorfer Straße 2, 21502 Geesthacht",
  website: "www.stadtwerke-geesthacht.de",
  linkedin: "linkedin.com/in/max-mustermann"
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
ADR:;;${mockCardData.address};;;;
URL:${mockCardData.website}
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Business Card Display */}
          <div className="flex justify-center">
            <BusinessCard data={mockCardData} />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button onClick={handleSaveContact} className="gap-2">
              <Download className="w-4 h-4" />
              Kontakt speichern
            </Button>
            <Button variant="outline" onClick={handleShare} className="gap-2">
              <Share2 className="w-4 h-4" />
              Teilen
            </Button>
          </div>

          {/* Contact Details Card */}
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="text-center border-b pb-4">
                  <h1 className="text-2xl font-bold text-business-text">{mockCardData.name}</h1>
                  <p className="text-lg text-business-primary font-medium">{mockCardData.position}</p>
                  <p className="text-muted-foreground">{mockCardData.company}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Email */}
                  <a 
                    href={`mailto:${mockCardData.email}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-business-primary/10 flex items-center justify-center group-hover:bg-business-primary/20 transition-colors">
                      <Mail className="w-5 h-5 text-business-primary" />
                    </div>
                    <div>
                      <p className="font-medium">E-Mail</p>
                      <p className="text-sm text-muted-foreground">{mockCardData.email}</p>
                    </div>
                  </a>

                  {/* Phone */}
                  <a 
                    href={`tel:${mockCardData.phone}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-business-primary/10 flex items-center justify-center group-hover:bg-business-primary/20 transition-colors">
                      <Phone className="w-5 h-5 text-business-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Telefon</p>
                      <p className="text-sm text-muted-foreground">{mockCardData.phone}</p>
                    </div>
                  </a>

                  {/* Website */}
                  {mockCardData.website && (
                    <a 
                      href={`https://${mockCardData.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-business-primary/10 flex items-center justify-center group-hover:bg-business-primary/20 transition-colors">
                        <Globe className="w-5 h-5 text-business-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Website</p>
                        <p className="text-sm text-muted-foreground">{mockCardData.website}</p>
                      </div>
                    </a>
                  )}

                  {/* LinkedIn */}
                  {mockCardData.linkedin && (
                    <a 
                      href={`https://${mockCardData.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-business-primary/10 flex items-center justify-center group-hover:bg-business-primary/20 transition-colors">
                        <Linkedin className="w-5 h-5 text-business-primary" />
                      </div>
                      <div>
                        <p className="font-medium">LinkedIn</p>
                        <p className="text-sm text-muted-foreground">{mockCardData.linkedin}</p>
                      </div>
                    </a>
                  )}
                </div>

                {/* Address */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-10 h-10 rounded-full bg-business-primary/10 flex items-center justify-center mt-0.5">
                    <MapPin className="w-5 h-5 text-business-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Adresse</p>
                    <p className="text-sm text-muted-foreground">{mockCardData.address}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Digitale Visitenkarte • Powered by {mockCardData.company}</p>
          </div>
        </div>
      </div>
    </div>
  );
}