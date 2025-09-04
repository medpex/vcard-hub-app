import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BusinessCard } from "@/components/BusinessCard";
import { Palette, Save, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getSettings, saveSettings, resetSettings, SettingsData } from "@/lib/client-api";

// Utility function to convert hex to HSL
function hexToHsl(hex: string): string {
  // Remove the hash if present
  hex = hex.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }

  // Convert to HSL format that Tailwind expects (e.g., "210 85% 45%")
  const hue = Math.round(h * 360);
  const saturation = Math.round(s * 100);
  const lightness = Math.round(l * 100);
  
  return `${hue} ${saturation}% ${lightness}%`;
}

// Default settings
const defaultSettings = {
  primaryColor: "#1e40af",
  secondaryColor: "#f8fafc", 
  textColor: "#1f2937",
  backgroundColor: "#ffffff",
  borderRadius: "8",
  companyName: "Stadtwerke Geesthacht",
  companyLogo: "",
  defaultAddress: "Stadtwerke Geesthacht, Geesthacht",
  defaultWebsite: "www.stadtwerke-geesthacht.de"
};

export default function Settings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const { toast } = useToast();

  // Load settings from database on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await getSettings();
        if (savedSettings) {
          setSettings(savedSettings);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
        toast({
          title: "Fehler",
          description: "Einstellungen konnten nicht geladen werden.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingSettings(false);
      }
    };

    loadSettings();
  }, [toast]);

  // Demo card data for preview
  const previewCardData = {
    id: "preview",
    name: "Max Mustermann",
    position: "Geschäftsführer",
    company: settings.companyName,
    email: "max.mustermann@example.com",
    phone: "+49 4152 123456",
    whatsapp: "+49 152 123456789",
    address: settings.defaultAddress,
    website: settings.defaultWebsite,
    linkedin: "linkedin.com/in/maxmustermann",
    instagram: "",
    bio: "Erfahrener Geschäftsführer mit Leidenschaft für nachhaltige Energielösungen.",
    avatar: "",
    companyLogo: settings.companyLogo
  };

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      await saveSettings(settings);
      
      toast({
        title: "Einstellungen gespeichert",
        description: "Die Designeinstellungen wurden erfolgreich in der Datenbank gespeichert.",
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Einstellungen konnten nicht gespeichert werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSettings = async () => {
    setIsLoading(true);
    try {
      await resetSettings();
      setSettings(defaultSettings);
      
      toast({
        title: "Zurückgesetzt",
        description: "Alle Einstellungen wurden auf Standard zurückgesetzt.",
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Einstellungen konnten nicht zurückgesetzt werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const presetColors = [
    { name: "Business Blau", primary: "#1e40af", secondary: "#f8fafc" },
    { name: "Stadtwerke Grün", primary: "#059669", secondary: "#f0fdf4" },
    { name: "Elegantes Grau", primary: "#374151", secondary: "#f9fafb" },
    { name: "Modernes Violett", primary: "#7c3aed", secondary: "#faf5ff" },
    { name: "Warmes Orange", primary: "#ea580c", secondary: "#fff7ed" },
    { name: "Tiefes Rot", primary: "#dc2626", secondary: "#fef2f2" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Einstellungen</h2>
          <p className="text-muted-foreground">
            Passen Sie das Design und die Standardwerte für Visitenkarten an
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleResetSettings} disabled={isLoading || isLoadingSettings}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Zurücksetzen
          </Button>
          <Button onClick={handleSaveSettings} disabled={isLoading || isLoadingSettings}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Speichere..." : "Speichern"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Settings Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Color Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Farbschema
              </CardTitle>
              <CardDescription>
                Passen Sie die Farben für Ihre Visitenkarten an
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Color Presets */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Vordefinierte Farbschemata</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {presetColors.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      className="h-auto p-3 flex flex-col items-start gap-2"
                      onClick={() => {
                        handleSettingChange('primaryColor', preset.primary);
                        handleSettingChange('secondaryColor', preset.secondary);
                      }}
                    >
                      <div className="flex gap-1 w-full">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: preset.secondary }}
                        />
                      </div>
                      <span className="text-xs">{preset.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Custom Colors */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primärfarbe</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                      placeholder="#1e40af"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Sekundärfarbe</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={settings.secondaryColor}
                      onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                      placeholder="#f8fafc"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="textColor">Textfarbe</Label>
                  <div className="flex gap-2">
                    <Input
                      id="textColor"
                      type="color"
                      value={settings.textColor}
                      onChange={(e) => handleSettingChange('textColor', e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={settings.textColor}
                      onChange={(e) => handleSettingChange('textColor', e.target.value)}
                      placeholder="#1f2937"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Hintergrundfarbe</Label>
                  <div className="flex gap-2">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={settings.backgroundColor}
                      onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={settings.backgroundColor}
                      onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Defaults */}
          <Card>
            <CardHeader>
              <CardTitle>Firmen-Standardwerte</CardTitle>
              <CardDescription>
                Diese Werte werden automatisch in neue Visitenkarten eingefügt
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Firmenname</Label>
                <Input
                  id="companyName"
                  value={settings.companyName}
                  onChange={(e) => handleSettingChange('companyName', e.target.value)}
                  placeholder="Stadtwerke Geesthacht"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultAddress">Standard-Adresse</Label>
                <Input
                  id="defaultAddress"
                  value={settings.defaultAddress}
                  onChange={(e) => handleSettingChange('defaultAddress', e.target.value)}
                  placeholder="Stadtwerke Geesthacht, Geesthacht"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultWebsite">Standard-Website</Label>
                <Input
                  id="defaultWebsite"
                  value={settings.defaultWebsite}
                  onChange={(e) => handleSettingChange('defaultWebsite', e.target.value)}
                  placeholder="www.stadtwerke-geesthacht.de"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="borderRadius">Ecken-Radius (px)</Label>
                <Input
                  id="borderRadius"
                  type="number"
                  min="0"
                  max="20"
                  value={settings.borderRadius}
                  onChange={(e) => handleSettingChange('borderRadius', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vorschau</CardTitle>
              <CardDescription>
                Live-Vorschau mit Ihren Einstellungen
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div style={{
                '--business-primary': hexToHsl(settings.primaryColor),
                '--business-secondary': hexToHsl(settings.secondaryColor),
                '--business-text': hexToHsl(settings.textColor),
                '--business-bg': hexToHsl(settings.backgroundColor),
              } as React.CSSProperties}>
                <BusinessCard 
                  data={previewCardData} 
                  variant="preview"
                  className="transform scale-90"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hinweis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Die Änderungen werden in Echtzeit in der Vorschau angezeigt. 
                Klicken Sie auf "Speichern", um die Einstellungen für neue 
                Visitenkarten zu übernehmen.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}