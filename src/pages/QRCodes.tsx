import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeGenerator } from "@/components/QRCodeGenerator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Eye, MoreHorizontal, User } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for business cards
const businessCards = [
  {
    id: "1",
    name: "Max Mustermann",
    position: "Geschäftsführer",
    company: "Stadtwerke Geesthacht",
    email: "max.mustermann@stadtwerke-geesthacht.de"
  },
  {
    id: "2", 
    name: "Anna Schmidt",
    position: "Marketing Leiterin",
    company: "Schmidt & Partner",
    email: "a.schmidt@schmidt-partner.de"
  },
  {
    id: "3",
    name: "Peter Weber", 
    position: "Vertriebsleiter",
    company: "Weber Solutions",
    email: "p.weber@weber-solutions.de"
  }
];

// Mock data for existing QR codes
const existingQRCodes = [
  {
    id: "1",
    name: "Max Mustermann",
    position: "Geschäftsführer",
    company: "Stadtwerke Geesthacht",
    scans: 42,
    lastScan: "Vor 2 Stunden",
    status: "active"
  },
  {
    id: "2",
    name: "Anna Schmidt",
    position: "Marketing Leiterin",
    company: "Schmidt & Partner",
    scans: 28,
    lastScan: "Gestern",
    status: "active"
  },
  {
    id: "3",
    name: "Peter Weber",
    position: "Vertriebsleiter",
    company: "Weber Solutions",
    scans: 156,
    lastScan: "Vor 5 Minuten",
    status: "active"
  }
];

export default function QRCodes() {
  const [selectedCardId, setSelectedCardId] = useState<string>("");
  const selectedCard = businessCards.find(card => card.id === selectedCardId);

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
              <Select value={selectedCardId} onValueChange={setSelectedCardId}>
                <SelectTrigger>
                  <SelectValue placeholder="Visitenkarte auswählen..." />
                </SelectTrigger>
                <SelectContent>
                  {businessCards.map((card) => (
                    <SelectItem key={card.id} value={card.id}>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{card.name}</div>
                          <div className="text-xs text-muted-foreground">{card.position} - {card.company}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedCard && (
                <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                  <div className="text-sm">
                    <div className="font-medium">{selectedCard.name}</div>
                    <div className="text-muted-foreground">{selectedCard.position}</div>
                    <div className="text-muted-foreground">{selectedCard.company}</div>
                    <div className="text-muted-foreground">{selectedCard.email}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {selectedCardId && (
            <QRCodeGenerator 
              businessCardId={selectedCardId} 
              contactName={selectedCard?.name}
              contactInfo={`${selectedCard?.position} - ${selectedCard?.company}`}
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
                <span className="text-sm font-medium">Gesamt Scans heute</span>
                <span className="text-2xl font-bold text-business-primary">127</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Aktive QR-Codes</span>
                <span className="text-2xl font-bold">{existingQRCodes.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Durchschnitt/Tag</span>
                <span className="text-2xl font-bold">89</span>
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
            {existingQRCodes.map((qrCode) => (
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
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        Ansehen
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        Herunterladen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
