import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BusinessCard } from "@/components/BusinessCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Share2, Phone, Mail, MapPin, Globe, Linkedin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCard } from "@/lib/client-api";


export default function BusinessCardView() {
  const { id } = useParams();
  const { toast } = useToast();
  const [cardData, setCardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadCard(id);
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const loadCard = async (cardId: string) => {
    try {
      setIsLoading(true);
      const card = await getCard(cardId);
      if (card) {
        setCardData({
          id: card.id,
          name: card.name,
          position: card.position || "",
          company: card.company || "",
          email: card.email || "",
          phone: card.phone || "",
          whatsapp: card.whatsapp || "",
          address: card.address || "",
          website: card.website || "",
          linkedin: card.linkedin || "",
          instagram: card.instagram || "",
          bio: card.bio || "",
          avatar: card.avatar || "",
          companyLogo: card.companyLogo || ""
        });
      } else {
        setError("Visitenkarte nicht gefunden");
      }
    } catch (error) {
      setError("Fehler beim Laden der Visitenkarte");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveContact = () => {
    // Generate vCard data
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${cardData.name}
ORG:${cardData.company}
TITLE:${cardData.position}
EMAIL:${cardData.email}
TEL:${cardData.phone}
TEL;TYPE=cell:${cardData.whatsapp}
ADR:;;${cardData.address};;;;
URL:${cardData.website}
NOTE:${cardData.bio}
END:VCARD`;

    // Create and download vCard file
    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cardData.name.replace(/\s+/g, '_')}.vcf`;
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
          title: `${cardData.name} - ${cardData.position}`,
          text: `Digitale Visitenkarte von ${cardData.name}`,
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-business-secondary via-background to-business-secondary/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-business-primary mx-auto mb-4"></div>
          <p>Visitenkarte wird geladen...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-business-secondary via-background to-business-secondary/50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Fehler</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-business-secondary via-background to-business-secondary/50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Main Business Card Display - Better container */}
          <div className="flex justify-center px-2 sm:px-4">
            <div className="w-full max-w-sm">
              <BusinessCard data={cardData} />
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


          {/* Footer */}
          <div className="text-center text-xs sm:text-sm text-muted-foreground px-4">
            <p>Digitale Visitenkarte • Powered by {cardData.company || 'vCard Hub'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}