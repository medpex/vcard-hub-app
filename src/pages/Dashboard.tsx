import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BusinessCard } from "@/components/BusinessCard";
import { Plus, Users, CreditCard, QrCode, TrendingUp } from "lucide-react";

// Mock data for demonstration
const mockCards = [
  {
    id: "1",
    name: "Max Mustermann",
    position: "Geschäftsführer",
    company: "Muster GmbH",
    email: "max.mustermann@muster.de",
    phone: "+49 123 456789",
    address: "Musterstraße 123, 21502 Geesthacht",
    website: "www.muster.de"
  },
  {
    id: "2", 
    name: "Anna Schmidt",
    position: "Marketing Leiterin",
    company: "Schmidt & Partner",
    email: "a.schmidt@schmidt-partner.de",
    phone: "+49 123 987654",
    address: "Hauptstraße 45, 21502 Geesthacht",
    linkedin: "linkedin.com/in/anna-schmidt"
  }
];

const stats = [
  {
    title: "Aktive Visitenkarten",
    value: "12",
    description: "Derzeit veröffentlicht",
    icon: CreditCard,
    change: "+2 diese Woche"
  },
  {
    title: "QR-Code Scans",
    value: "248",
    description: "Letzten 30 Tage",
    icon: QrCode,
    change: "+15% zum Vormonat"
  },
  {
    title: "Mitarbeiter",
    value: "8",
    description: "Registrierte Nutzer",
    icon: Users,
    change: "+1 diese Woche"
  },
  {
    title: "Seitenaufrufe",
    value: "1.2k",
    description: "Letzten 30 Tage", 
    icon: TrendingUp,
    change: "+23% zum Vormonat"
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Übersicht über Ihre digitalen Visitenkarten
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Neue Visitenkarte
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              <p className="text-xs text-business-primary font-medium mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Business Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Zuletzt erstellt</CardTitle>
            <CardDescription>
              Die neuesten digitalen Visitenkarten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCards.map((card) => (
                <div key={card.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{card.name}</h4>
                    <p className="text-sm text-muted-foreground">{card.position}</p>
                    <p className="text-sm text-muted-foreground">{card.company}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Bearbeiten
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visitenkarten Vorschau</CardTitle>
            <CardDescription>
              Beispiel einer digitalen Visitenkarte
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <BusinessCard 
              data={mockCards[0]} 
              variant="preview"
            />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Schnellaktionen</CardTitle>
          <CardDescription>
            Häufig verwendete Funktionen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Plus className="w-6 h-6" />
              <span>Neue Visitenkarte erstellen</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <QrCode className="w-6 h-6" />
              <span>QR-Code generieren</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Users className="w-6 h-6" />
              <span>Mitarbeiter hinzufügen</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}