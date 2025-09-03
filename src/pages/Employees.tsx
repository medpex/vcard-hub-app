import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Mail, Phone, MoreHorizontal, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for employees
const mockEmployees = [
  {
    id: "1",
    name: "Max Mustermann",
    position: "Geschäftsführer",
    email: "max.mustermann@muster.de",
    phone: "+49 123 456789",
    status: "Aktiv",
    hasCard: true,
    lastActive: "Heute",
  },
  {
    id: "2",
    name: "Anna Schmidt",
    position: "Marketing Leiterin",
    email: "a.schmidt@schmidt-partner.de",
    phone: "+49 123 987654",
    status: "Aktiv",
    hasCard: true,
    lastActive: "Gestern",
  },
  {
    id: "3",
    name: "Thomas Weber",
    position: "Vertriebsleiter",
    email: "t.weber@muster.de",
    phone: "+49 123 555666",
    status: "Inaktiv",
    hasCard: false,
    lastActive: "Vor 5 Tagen",
  },
];

export default function Employees() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mitarbeiter</h2>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Mitarbeiter und deren Visitenkarten
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Mitarbeiter hinzufügen
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Gesamte Mitarbeiter
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockEmployees.length}</div>
            <p className="text-xs text-muted-foreground">
              Registrierte Nutzer
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aktive Mitarbeiter
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockEmployees.filter(emp => emp.status === "Aktiv").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Mit Visitenkarten
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Visitenkarten erstellt
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockEmployees.filter(emp => emp.hasCard).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Von {mockEmployees.length} Mitarbeitern
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Employee List */}
      <Card>
        <CardHeader>
          <CardTitle>Mitarbeiterliste</CardTitle>
          <CardDescription>
            Übersicht aller registrierten Mitarbeiter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockEmployees.map((employee) => (
              <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-business-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-business-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{employee.name}</h4>
                    <p className="text-sm text-muted-foreground">{employee.position}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        {employee.email}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        {employee.phone}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant={employee.status === "Aktiv" ? "default" : "secondary"}>
                    {employee.status}
                  </Badge>
                  <Badge variant={employee.hasCard ? "default" : "outline"}>
                    {employee.hasCard ? "Hat Visitenkarte" : "Keine Visitenkarte"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {employee.lastActive}
                  </span>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                      <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                      <DropdownMenuItem>Visitenkarte erstellen</DropdownMenuItem>
                      <DropdownMenuItem>E-Mail senden</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Entfernen
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