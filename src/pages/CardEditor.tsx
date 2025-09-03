import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BusinessCard } from "@/components/BusinessCard";
import { Save, Eye, Plus, Upload } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Here would be the API call to save the card
    toast({
      title: "Visitenkarte gespeichert",
      description: "Die digitale Visitenkarte wurde erfolgreich aktualisiert.",
    });
  };

  const handleFileUpload = (field: string) => {
    // Simulate file upload
    toast({
      title: "Datei hochgeladen",
      description: "Das Bild wurde erfolgreich hochgeladen.",
    });
  };

  const handlePublicView = () => {
    console.log('Navigating to public view');
    navigate('/card/demo');
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
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Speichern
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
                    <Button 
                      variant="outline" 
                      onClick={() => handleFileUpload('avatar')}
                      className="w-full gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Profilbild hochladen
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Firmenlogo</Label>
                    <Button 
                      variant="outline" 
                      onClick={() => handleFileUpload('companyLogo')}
                      className="w-full gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Logo hochladen
                    </Button>
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