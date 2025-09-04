import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarUpload } from "@/components/AvatarUpload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createEmployee, updateEmployee, type EmployeeData } from "@/lib/client-api";

interface EmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: any;
  onSuccess: () => void;
}

export function EmployeeDialog({ open, onOpenChange, employee, onSuccess }: EmployeeDialogProps) {
  const [formData, setFormData] = useState<EmployeeData & { avatar?: string }>({
    name: employee?.name || "",
    position: employee?.position || "",
    email: employee?.email || "",
    phone: employee?.phone || "",
    department: employee?.department || "",
    status: employee?.status || "Aktiv",
    avatar: employee?.avatar || ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof (EmployeeData & { avatar?: string }), value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.position || !formData.email || !formData.phone) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Pflichtfelder aus.",
        variant: "destructive"
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      if (employee) {
        // Update existing employee
        await updateEmployee(employee.id, formData);
        toast({
          title: "Mitarbeiter aktualisiert",
          description: "Der Mitarbeiter wurde erfolgreich aktualisiert.",
        });
      } else {
        // Create new employee
        await createEmployee(formData);
        toast({
          title: "Mitarbeiter hinzugefügt",
          description: "Der Mitarbeiter wurde erfolgreich hinzugefügt.",
        });
      }
      
      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        name: "",
        position: "",
        email: "",
        phone: "",
        department: "",
        status: "Aktiv"
      });
    } catch (error) {
      console.error('Employee creation failed:', error);
      toast({
        title: "Fehler",
        description: `Mitarbeiter konnte nicht gespeichert werden: ${error.message || error}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {employee ? "Mitarbeiter bearbeiten" : "Mitarbeiter hinzufügen"}
            </DialogTitle>
            <DialogDescription>
              {employee 
                ? "Bearbeiten Sie die Informationen des Mitarbeiters."
                : "Fügen Sie einen neuen Mitarbeiter zu Ihrem Team hinzu."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Max Mustermann"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  placeholder="Geschäftsführer"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="max@beispiel.de"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+49 123 456789"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Abteilung</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                placeholder="z.B. IT, Marketing, Vertrieb"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Profilbild</Label>
              <div className="flex justify-center py-2">
                <AvatarUpload
                  currentAvatar={formData.avatar}
                  userName={formData.name || "Neuer Mitarbeiter"}
                  onAvatarChange={(avatar) => handleInputChange('avatar', avatar)}
                  size="md"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange('status', value as 'Aktiv' | 'Inaktiv')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aktiv">Aktiv</SelectItem>
                  <SelectItem value="Inaktiv">Inaktiv</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Abbrechen
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading 
                ? (employee ? "Aktualisieren..." : "Hinzufügen...") 
                : (employee ? "Aktualisieren" : "Hinzufügen")
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}