import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BusinessCard } from "@/components/BusinessCard";
import { AvatarUpload } from "@/components/AvatarUpload";
import { Save, Eye, Plus, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createCard, updateCard, getCard, updateEmployee, type CardData } from "@/lib/client-api";

// Empty form data - users can fill in their own information
const initialFormData = {
  name: "",
  position: "",
  company: "",
  email: "",
  phone: "",
  whatsapp: "",
  address: "",
  website: "",
  linkedin: "",
  instagram: "",
  bio: "",
  avatar: "",
  companyLogo: ""
};

export default function CardEditor() {
  const [formData, setFormData] = useState(initialFormData);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCardId, setCurrentCardId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Load existing card if editing or prefill from employee data
  useEffect(() => {
    const cardId = searchParams.get('id');
    const employeeId = searchParams.get('employee');
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    const position = searchParams.get('position');
    
    if (cardId) {
      loadCard(cardId);
    } else if (employeeId && name) {
      // Pre-fill form with employee data
      setFormData({
        name: decodeURIComponent(name),
        position: position ? decodeURIComponent(position) : "",
        company: "Stadtwerke Geesthacht", // Default company
        email: email ? decodeURIComponent(email) : "",
        phone: phone ? decodeURIComponent(phone) : "",
        whatsapp: "",
        address: "",
        website: "",
        linkedin: "",
        instagram: "",
        bio: "",
        avatar: "",
        companyLogo: ""
      });
    }
  }, [searchParams]);

  const loadCard = async (cardId: string) => {
    try {
      setIsLoading(true);
      const card = await getCard(cardId);
      if (card) {
        setFormData({
          name: card.name || "",
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
        setCurrentCardId(card.id);
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Visitenkarte konnte nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast({
        title: "Fehler",
        description: "Name ist ein Pflichtfeld.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      let card;
      
      if (currentCardId) {
        // Update existing card
        card = await updateCard(currentCardId, formData);
        toast({
          title: "Visitenkarte aktualisiert",
          description: "Die digitale Visitenkarte wurde erfolgreich aktualisiert.",
        });
      } else {
        // Create new card
        const employeeId = searchParams.get('employee');
        card = await createCard(formData, employeeId || undefined);
        setCurrentCardId(card.id);
        
        // Update employee to mark they have a card
        if (employeeId) {
          try {
            await updateEmployee(employeeId, { hasCard: true });
          } catch (error) {
            console.error('Failed to update employee:', error);
          }
        }
        
        toast({
          title: "Visitenkarte erstellt",
          description: "Die digitale Visitenkarte wurde erfolgreich erstellt.",
        });
        
        // Update URL to include the new card ID
        navigate(`/cards?id=${card.id}`, { replace: true });
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Visitenkarte konnte nicht gespeichert werden.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (field: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "Datei zu groß",
            description: "Bitte wählen Sie eine Datei unter 5MB aus.",
            variant: "destructive"
          });
          return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Ungültiger Dateityp",
            description: "Bitte wählen Sie eine Bilddatei aus.",
            variant: "destructive"
          });
          return;
        }

        // Convert to base64 for storage
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          handleInputChange(field, base64);
          toast({
            title: "Bild hochgeladen",
            description: `${field === 'avatar' ? 'Profilbild' : 'Firmenlogo'} wurde erfolgreich hochgeladen.`,
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handlePublicView = () => {
    if (currentCardId) {
      navigate(`/card/${currentCardId}`);
    } else {
      toast({
        title: "Hinweis",
        description: "Speichern Sie die Karte zuerst, um die öffentliche Ansicht zu sehen.",
        variant: "destructive"
      });
    }
  };

  const handleGenerateQR = () => {
    console.log('Navigating to QR codes');
    navigate('/qr-codes');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Visitenkarte bearbeiten</h2>
          <p className="text-muted-foreground">
            Erstellen und bearbeiten Sie digitale Visitenkarten
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowPreview(!showPreview)}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? 'Formular' : 'Vorschau'}
          </Button>
          <Button onClick={handleSave} disabled={isLoading} className="gap-2">
            <Save className="w-4 h-4" />
            {isLoading ? 'Speichern...' : 'Speichern'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        {!showPreview && (
          <Card>
            <CardHeader>
              <CardTitle>Persönliche Informationen</CardTitle>
              <CardDescription>
                Füllen Sie alle relevanten Felder aus
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Max Mustermann"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    placeholder="Geschäftsführer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Unternehmen *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Stadtwerke Geesthacht"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Beschreibung</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Kurze Beschreibung über Sie..."
                  rows={3}
                />
              </div>

              {/* Contact Info */}
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Kontaktinformationen</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-Mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="max@beispiel.de"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+49 123 456789"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={formData.whatsapp}
                      onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                      placeholder="+49 152 123456789"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Musterstraße 123, 12345 Musterstadt"
                    />
                  </div>
                </div>
              </div>

              {/* Online Presence */}
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Online-Präsenz</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="www.beispiel.de"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={formData.linkedin}
                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                        placeholder="linkedin.com/in/maxmustermann"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        value={formData.instagram}
                        onChange={(e) => handleInputChange('instagram', e.target.value)}
                        placeholder="maxmustermann_official"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Bilder</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Profilbild</Label>
                    <div className="flex justify-center py-4">
                      <AvatarUpload
                        currentAvatar={formData.avatar}
                        userName={formData.name || "Neuer Nutzer"}
                        onAvatarChange={(avatar) => handleInputChange('avatar', avatar)}
                        size="lg"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Firmenlogo</Label>
                    {formData.companyLogo ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                          <img 
                            src={formData.companyLogo} 
                            alt="Firmenlogo Vorschau" 
                            className="max-h-28 max-w-full object-contain rounded"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            onClick={() => handleFileUpload('companyLogo')}
                            className="flex-1 gap-2"
                            size="sm"
                          >
                            <Upload className="w-4 h-4" />
                            Ändern
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => handleInputChange('companyLogo', '')}
                            size="sm"
                          >
                            Entfernen
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        onClick={() => handleFileUpload('companyLogo')}
                        className="w-full gap-2 h-32 border-dashed"
                      >
                        <Upload className="w-4 h-4" />
                        Logo hochladen
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Preview */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vorschau</CardTitle>
              <CardDescription>
                So wird Ihre digitale Visitenkarte aussehen
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <BusinessCard data={formData} />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Aktionen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full gap-2" onClick={handlePublicView}>
                <Eye className="w-4 h-4" />
                Öffentliche Ansicht
              </Button>
              <Button variant="outline" className="w-full gap-2" onClick={handleGenerateQR}>
                <Plus className="w-4 h-4" />
                QR-Code generieren
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}