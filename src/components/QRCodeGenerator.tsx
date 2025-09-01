import { useState } from "react";
import QRCode from "qrcode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Copy, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRCodeGeneratorProps {
  businessCardId?: string;
  className?: string;
}

export function QRCodeGenerator({ businessCardId, className = "" }: QRCodeGeneratorProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      // In real app, this would be the actual URL to the business card
      const businessCardUrl = businessCardId 
        ? `${window.location.origin}/card/${businessCardId}`
        : `${window.location.origin}/card/demo`;

      const qrCodeDataUrl = await QRCode.toDataURL(businessCardUrl, {
        errorCorrectionLevel: 'M',
        margin: 1,
        color: {
          dark: '#1e40af', // business primary color
          light: '#ffffff'
        },
        width: 256
      });

      setQrCodeDataUrl(qrCodeDataUrl);
      
      toast({
        title: "QR-Code generiert",
        description: "Der QR-Code wurde erfolgreich erstellt.",
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "QR-Code konnte nicht generiert werden.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return;

    const link = document.createElement('a');
    link.download = `visitenkarte-qr-${businessCardId || 'demo'}.png`;
    link.href = qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "QR-Code heruntergeladen",
      description: "Der QR-Code wurde als PNG-Datei gespeichert.",
    });
  };

  const copyQRCodeUrl = async () => {
    const businessCardUrl = businessCardId 
      ? `${window.location.origin}/card/${businessCardId}`
      : `${window.location.origin}/card/demo`;

    try {
      await navigator.clipboard.writeText(businessCardUrl);
      toast({
        title: "URL kopiert",
        description: "Die Visitenkarten-URL wurde in die Zwischenablage kopiert.",
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "URL konnte nicht kopiert werden.",
        variant: "destructive",
      });
    }
  };

  const shareQRCode = async () => {
    const businessCardUrl = businessCardId 
      ? `${window.location.origin}/card/${businessCardId}`
      : `${window.location.origin}/card/demo`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Digitale Visitenkarte',
          text: 'Schauen Sie sich meine digitale Visitenkarte an',
          url: businessCardUrl,
        });
      } catch (error) {
        console.log('Sharing cancelled');
      }
    } else {
      copyQRCodeUrl();
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          QR-Code Generator
        </CardTitle>
        <CardDescription>
          Erstellen Sie einen QR-Code für die digitale Visitenkarte
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={generateQRCode} 
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? "Generiere..." : "QR-Code generieren"}
        </Button>

        {qrCodeDataUrl && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-white rounded-lg border">
                <img 
                  src={qrCodeDataUrl} 
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" onClick={downloadQRCode}>
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={copyQRCodeUrl}>
                <Copy className="w-4 h-4 mr-1" />
                URL kopieren
              </Button>
              <Button variant="outline" size="sm" onClick={shareQRCode}>
                <Share2 className="w-4 h-4 mr-1" />
                Teilen
              </Button>
            </div>

            <div className="text-center">
              <Label className="text-sm text-muted-foreground">
                QR-Code verweist auf: /card/{businessCardId || 'demo'}
              </Label>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}