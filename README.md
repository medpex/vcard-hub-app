# VCard Hub - Digitale Visitenkarten für Stadtwerke Geesthacht

Eine moderne, webbasierte Anwendung zur Erstellung und Verwaltung von digitalen Visitenkarten mit QR-Code-Funktionalität, speziell entwickelt für die Stadtwerke Geesthacht.

## 🌟 Features

### 📇 Visitenkarten-Management
- **Digitale Visitenkarten erstellen**: Vollständige Kontaktinformationen mit Profilbildern
- **Live-Vorschau**: Sofortige Vorschau der Visitenkarte während der Bearbeitung
- **Responsive Design**: Optimiert für alle Geräte (Desktop, Tablet, Mobile)
- **Öffentliche Freigabe**: Visitenkarten über eindeutige URLs teilen

### 👥 Mitarbeiter-Verwaltung
- **Mitarbeiter-Datenbank**: Zentrale Verwaltung aller Teammitglieder
- **Profilbilder**: Automatisches kreisförmiges Zuschneiden von Profilfotos
- **Zoom-Funktion**: Präzise Positionierung und Skalierung der Bilder
- **Status-Tracking**: Aktiv/Inaktiv Status und Visitenkarten-Zuordnung

### 🎨 Anpassbare Designs
- **Farb-Schemata**: Vordefinierte und benutzerdefinierte Farbpaletten
- **Live-Vorschau**: Echtzeit-Vorschau der Design-Änderungen
- **Unternehmens-Branding**: Logo und Standard-Informationen konfigurierbar
- **Responsive Layouts**: Automatische Anpassung an verschiedene Bildschirmgrößen

### 📱 QR-Code-System
- **Automatische QR-Generierung**: Für jede Visitenkarte
- **Multiple QR-Codes**: Verschiedene QR-Codes pro Karte möglich
- **Download-Funktionen**: QR-Codes in verschiedenen Formaten
- **URL-Struktur**: `https://card.swg-lab.de/{cardId}`

### 📊 Dashboard & Analytics
- **Übersichts-Dashboard**: Statistiken und wichtige Kennzahlen
- **Mitarbeiter-Statistiken**: Anzahl aktiver Mitarbeiter und Visitenkarten
- **Benutzerfreundliche Navigation**: Intuitive Menüführung

## 🛠 Technologie-Stack

### Frontend
- **React 18** mit TypeScript
- **Vite** als Build-Tool und Dev-Server
- **Tailwind CSS** für Styling
- **shadcn/ui** als UI-Komponenten-Bibliothek
- **Lucide React** für Icons
- **React Router** für Navigation

### Backend
- **Node.js** mit Express.js
- **PostgreSQL** Datenbank
- **Prisma ORM** für Datenbankoperationen
- **CORS** für Cross-Origin-Requests

### Weitere Tools
- **QR Code Generator**: Automatische QR-Code-Erstellung
- **Canvas API**: Für Bildbearbeitung und -zuschnitt
- **Base64 Encoding**: Für Bild-Speicherung
- **Responsive Design**: Mobile-First-Ansatz

## 📁 Projektstruktur

```
vcard-hub-app/
├── src/
│   ├── components/          # Wiederverwendbare UI-Komponenten
│   │   ├── ui/             # shadcn/ui Basis-Komponenten
│   │   ├── AvatarUpload.tsx     # Profilbild-Upload mit Zoom
│   │   ├── ImageCropper.tsx     # Bildbearbeitung und Zuschnitt
│   │   ├── QRCodeGenerator.tsx  # QR-Code-Generierung
│   │   └── EmployeeDialog.tsx   # Mitarbeiter-Dialog
│   ├── pages/              # Seiten-Komponenten
│   │   ├── Dashboard.tsx   # Haupt-Dashboard
│   │   ├── CardEditor.tsx  # Visitenkarten-Editor
│   │   ├── Employees.tsx   # Mitarbeiter-Verwaltung
│   │   ├── Settings.tsx    # Einstellungen und Design
│   │   └── QRCodes.tsx     # QR-Code-Verwaltung
│   ├── lib/                # Utility-Funktionen
│   │   ├── client-api.ts   # Frontend-API-Client
│   │   ├── api.ts          # Backend-API-Funktionen
│   │   └── db.ts          # Prisma-Datenbankverbindung
│   └── hooks/              # Custom React Hooks
├── prisma/
│   └── schema.prisma       # Datenbankschema
├── server.cjs              # Express.js Backend-Server
├── vite.config.ts          # Vite-Konfiguration
└── tailwind.config.js      # Tailwind-CSS-Konfiguration
```

## 🚀 Installation & Setup

### Voraussetzungen
- Node.js (v18 oder höher)
- PostgreSQL-Datenbank
- Git

### 1. Repository klonen
```bash
git clone <repository-url>
cd vcard-hub-app
```

### 2. Dependencies installieren
```bash
npm install
```

### 3. Umgebungsvariablen konfigurieren
```bash
# .env erstellen und konfigurieren
DATABASE_URL="postgresql://username:password@localhost:5432/vcard_hub"
```

### 4. Datenbank setup
```bash
# Prisma generieren
npx prisma generate

# Datenbank migrieren
npx prisma db push

# Optional: Prisma Studio öffnen
npx prisma studio
```

### 5. Anwendung starten

**Frontend (Port 8080):**
```bash
npm run dev
```

**Backend (Port 3001):**
```bash
npm run server
```

Die Anwendung ist dann unter `http://localhost:8080` erreichbar.

## 🗄 Datenbank-Schema

### Tabellen-Übersicht

**Users** - Benutzer-Verwaltung
- `id`: Eindeutige Benutzer-ID
- `email`: E-Mail-Adresse
- `name`: Benutzername

**Cards** - Visitenkarten
- `id`: Karten-ID
- `name`, `position`, `company`: Grunddaten
- `email`, `phone`, `whatsapp`: Kontaktdaten
- `address`, `website`: Weitere Informationen
- `linkedin`, `instagram`: Social Media
- `bio`: Beschreibung
- `avatar`, `companyLogo`: Bilder (Base64)
- `slug`: URL-Slug für öffentlichen Zugriff
- `views`: Aufruf-Statistiken

**Employees** - Mitarbeiter-Verwaltung
- `id`: Mitarbeiter-ID
- `name`, `position`, `email`, `phone`: Grunddaten
- `department`: Abteilung
- `status`: Aktiv/Inaktiv
- `hasCard`: Visitenkarten-Zuordnung
- `avatar`: Profilbild (Base64)

**QRCodes** - QR-Code-Verwaltung
- `id`: QR-Code-ID
- `name`: Bezeichnung
- `url`: Ziel-URL
- `qrData`: QR-Code-Daten
- `downloads`: Download-Statistiken

**Settings** - System-Einstellungen
- `primaryColor`, `secondaryColor`: Farbschema
- `textColor`, `backgroundColor`: Layout-Farben
- `companyName`, `companyLogo`: Unternehmens-Daten
- `defaultAddress`, `defaultWebsite`: Standard-Werte

## 🎨 Design-System

### Farbschemata
- **Business Blue**: Professionelles Blau-Schema
- **Nature Green**: Umweltfreundliches Grün
- **Sunset Orange**: Warmes Orange-Schema
- **Royal Purple**: Elegantes Lila
- **Custom**: Benutzerdefinierte Farben

### UI-Komponenten
- Basiert auf **shadcn/ui**
- **Tailwind CSS** für Styling
- **Responsive Design** für alle Geräte
- **Dark/Light Mode** unterstützt

## 🔧 API-Endpunkte

### Visitenkarten-API
- `GET /api/cards` - Alle Karten abrufen
- `POST /api/cards` - Neue Karte erstellen
- `GET /api/cards/:id` - Spezifische Karte abrufen
- `PUT /api/cards/:id` - Karte aktualisieren
- `DELETE /api/cards/:id` - Karte löschen

### Mitarbeiter-API
- `GET /api/employees` - Alle Mitarbeiter
- `POST /api/employees` - Mitarbeiter erstellen
- `PUT /api/employees/:id` - Mitarbeiter aktualisieren
- `DELETE /api/employees/:id` - Mitarbeiter löschen

### QR-Code-API
- `GET /api/cards/:cardId/qrcodes` - QR-Codes einer Karte
- `POST /api/qrcodes` - QR-Code erstellen
- `DELETE /api/qrcodes/:id` - QR-Code löschen

### Einstellungen-API
- `GET /api/settings` - Einstellungen abrufen
- `PUT /api/settings` - Einstellungen speichern

## 📱 Mobile Optimierung

- **Responsive Design**: Automatische Anpassung an Bildschirmgrößen
- **Touch-optimiert**: Alle Interaktionen für Touchscreens optimiert
- **PWA-ready**: Vorbereitet für Progressive Web App
- **Performance**: Optimiert für mobile Verbindungen

## 🔒 Sicherheit

- **Input-Validierung**: Alle Eingaben werden validiert
- **File-Upload-Beschränkungen**: Maximale Dateigröße 5MB
- **CORS-Konfiguration**: Sichere Cross-Origin-Requests
- **SQL-Injection-Schutz**: Durch Prisma ORM
- **XSS-Schutz**: Sichere Ausgabe von Benutzerdaten

## 📈 Erweiterungsmöglichkeiten

### Geplante Features
- **Benutzer-Authentifizierung**: Login/Logout-System
- **Team-Management**: Mehrere Benutzer-Rollen
- **Analytics**: Detaillierte Aufruf-Statistiken
- **Export-Funktionen**: PDF/vCard-Export
- **API-Integration**: Externe Systeme anbinden
- **Push-Benachrichtigungen**: Für Updates

### Technische Verbesserungen
- **Caching**: Redis für bessere Performance
- **CDN**: Für statische Assets
- **Database-Optimierung**: Indizierung und Queries
- **Tests**: Unit- und Integrationstests
- **CI/CD**: Automatische Deployments

## 🐛 Bekannte Probleme

- **Bildverarbeitung**: Sehr große Bilder können langsam sein
- **Browser-Kompatibilität**: Canvas-Features in älteren Browsern
- **Performance**: Bei vielen Mitarbeitern kann die Liste langsam werden

## 💡 Beitragen

1. Fork des Repositories
2. Feature-Branch erstellen (`git checkout -b feature/new-feature`)
3. Änderungen committen (`git commit -m 'Add new feature'`)
4. Branch pushen (`git push origin feature/new-feature`)
5. Pull Request erstellen

## 📄 Lizenz

Dieses Projekt wurde speziell für die Stadtwerke Geesthacht entwickelt.

## 📞 Kontakt

**Entwickelt für:**
Stadtwerke Geesthacht
Website: www.stadtwerke-geesthacht.de

**Technische Umsetzung:**
Entwickelt mit Claude Code von Anthropic
