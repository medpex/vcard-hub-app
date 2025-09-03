import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BusinessCard } from "@/components/BusinessCard";
import { Plus, Users, CreditCard, QrCode, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Empty data - users can add their own
const mockCards: any[] = [];

const stats = [
  {
    title: "Aktive Visitenkarten",
    value: "0",
    description: "Derzeit veröffentlicht",
    icon: CreditCard,
    change: "Noch keine erstellt"
  },
  {
    title: "QR-Code Scans",
    value: "0",
    description: "Letzten 30 Tage",
    icon: QrCode,
    change: "Noch keine Scans"
  },
  {
    title: "Mitarbeiter",
    value: "0",
    description: "Registrierte Nutzer",
    icon: Users,
    change: "Noch keine hinzugefügt"
  },
  {
    title: "Seitenaufrufe",
    value: "0",
    description: "Letzten 30 Tage", 
    icon: TrendingUp,
    change: "Noch keine Aufrufe"
  }
];

export default function Dashboard() {
  const navigate = useNavigate();

  const handleNewCard = () => {
    console.log('Button clicked - navigating to cards');
    navigate('/cards');
  };

  const handleEditCard = (cardId: string) => {
    navigate('/cards');
  };

  const handleGenerateQR = () => {
    navigate('/qr-codes');
  };

  const handleAddEmployee = () => {
    navigate('/employees');
  };

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
        <Button className="gap-2" onClick={handleNewCard}>
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
              {mockCards.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Noch keine Visitenkarten erstellt</p>
                  <p className="text-sm">Klicken Sie auf "Neue Visitenkarte" um zu beginnen</p>
                </div>
              ) : (
                mockCards.map((card) => (
                  <div key={card.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{card.name}</h4>
                      <p className="text-sm text-muted-foreground">{card.position}</p>
                      <p className="text-sm text-muted-foreground">{card.company}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleEditCard(card.id)}>
                      Bearbeiten
                    </Button>
                  </div>
                ))
              )}
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
            {mockCards.length > 0 ? (
              <BusinessCard 
                data={mockCards[0]} 
                variant="preview"
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Erstellen Sie zuerst eine Visitenkarte</p>
              </div>
            )}
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
            <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={handleNewCard}>
              <Plus className="w-6 h-6" />
              <span>Neue Visitenkarte erstellen</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={handleGenerateQR}>
              <QrCode className="w-6 h-6" />
              <span>QR-Code generieren</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={handleAddEmployee}>
              <Users className="w-6 h-6" />
              <span>Mitarbeiter hinzufügen</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}