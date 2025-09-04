import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeGenerator } from "@/components/QRCodeGenerator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Eye, MoreHorizontal, User, Trash2, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserCards, deleteCard } from "@/lib/client-api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function QRCodes() {
  const [selectedCardId, setSelectedCardId] = useState<string>("");
  const [businessCards, setBusinessCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setIsLoading(true);
      const cards = await getUserCards();
      setBusinessCards(cards);
    } catch (error) {
      console.error('Failed to load cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewCard = (cardId: string) => {
    navigate(`/card/${cardId}`);
  };

  const handleEditCard = (cardId: string) => {
    navigate(`/cards?id=${cardId}`);
  };

  const handleDeleteCard = async (cardId: string, cardName: string) => {
    if (!window.confirm(`Möchten Sie die Visitenkarte "${cardName}" und den zugehörigen QR-Code wirklich löschen?`)) {
      return;
    }

    try {
      await deleteCard(cardId);
      
      // Reset selected card if it was deleted
      if (selectedCardId === cardId) {
        setSelectedCardId("");
      }
      
      // Reload cards
      loadCards();
      
      toast({
        title: "Gelöscht",
        description: `Visitenkarte "${cardName}" und QR-Code wurden erfolgreich gelöscht.`,
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Visitenkarte konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    }
  };

  const selectedCard = businessCards.find(card => card.id === selectedCardId);

  // Mock QR codes data for now - in production this would come from API
  const existingQRCodes = businessCards.map(card => ({
    id: card.id,
    name: card.name,
    position: card.position || "Unbekannte Position",
    company: card.company || "Unbekanntes Unternehmen",
    scans: card.views || 0,
    lastScan: card.views > 0 ? "Kürzlich" : "Noch nie",
    status: 'active'
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">QR-Codes</h2>
          <p className="text-muted-foreground">
            Generieren und verwalten Sie QR-Codes für digitale Visitenkarten
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* QR Code Generator */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visitenkarte auswählen</CardTitle>
              <CardDescription>
                Wählen Sie eine Visitenkarte für den QR-Code aus
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-business-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Lade Visitenkarten...</p>
                </div>
              ) : (
                <Select value={selectedCardId} onValueChange={setSelectedCardId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Visitenkarte auswählen..." />
                  </SelectTrigger>
                  <SelectContent>
                    {businessCards.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        Keine Visitenkarten vorhanden. Erstellen Sie zuerst eine Visitenkarte.
                      </div>
                    ) : (
                      businessCards.map((card) => (
                        <SelectItem key={card.id} value={card.id}>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <div>
                              <div className="font-medium">{card.name}</div>
                              <div className="text-xs text-muted-foreground">{card.position || "Position"} - {card.company || "Firma"}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
              
              {selectedCard && (
                <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                  <div className="text-sm">
                    <div className="font-medium">{selectedCard.name}</div>
                    <div className="text-muted-foreground">{selectedCard.position || "Position"}</div>
                    <div className="text-muted-foreground">{selectedCard.company || "Firma"}</div>
                    <div className="text-muted-foreground">{selectedCard.email || "E-Mail"}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {selectedCardId && (
            <QRCodeGenerator 
              businessCardId={selectedCardId}
            />
          )}
        </div>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>QR-Code Statistiken</CardTitle>
            <CardDescription>
              Übersicht über QR-Code Nutzung
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Gesamt Aufrufe</span>
                <span className="text-2xl font-bold text-business-primary">{businessCards.reduce((sum, card) => sum + (card.views || 0), 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Visitenkarten</span>
                <span className="text-2xl font-bold">{businessCards.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Durchschnitt/Karte</span>
                <span className="text-2xl font-bold">{businessCards.length > 0 ? Math.round(businessCards.reduce((sum, card) => sum + (card.views || 0), 0) / businessCards.length) : 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Existing QR Codes */}
      <Card>
        <CardHeader>
          <CardTitle>Bestehende QR-Codes</CardTitle>
          <CardDescription>
            Übersicht aller generierten QR-Codes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {existingQRCodes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Noch keine QR-Codes generiert.</p>
                <p className="text-sm mt-1">Wählen Sie eine Visitenkarte aus und generieren Sie Ihren ersten QR-Code.</p>
              </div>
            ) : (
              existingQRCodes.map((qrCode) => (
                <div key={qrCode.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <h4 className="font-medium">{qrCode.name}</h4>
                        <p className="text-sm text-muted-foreground">{qrCode.position}</p>
                        <p className="text-sm text-muted-foreground">{qrCode.company}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{qrCode.scans} Scans</p>
                      <p className="text-xs text-muted-foreground">{qrCode.lastScan}</p>
                    </div>
                    
                    <Badge variant={qrCode.status === 'active' ? 'default' : 'secondary'}>
                      {qrCode.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                    </Badge>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewCard(qrCode.id)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Ansehen
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditCard(qrCode.id)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Bearbeiten
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Herunterladen
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteCard(qrCode.id, qrCode.name)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Löschen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
