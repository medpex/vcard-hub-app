import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Camera, User } from "lucide-react";
import { ImageCropper } from "./ImageCropper";

interface AvatarUploadProps {
  currentAvatar?: string;
  userName: string;
  onAvatarChange: (avatar: string) => void;
  size?: "sm" | "md" | "lg";
}

export function AvatarUpload({ currentAvatar, userName, onAvatarChange, size = "md" }: AvatarUploadProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tempAvatar, setTempAvatar] = useState<string>("");

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32"
  };

  const buttonSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5", 
    lg: "w-6 h-6"
  };

  const handleImageCropped = (croppedImage: string) => {
    setTempAvatar(croppedImage);
  };

  const handleSave = () => {
    if (tempAvatar) {
      onAvatarChange(tempAvatar);
      setIsDialogOpen(false);
      setTempAvatar("");
    }
  };

  const handleCancel = () => {
    setTempAvatar("");
    setIsDialogOpen(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative group">
        <Avatar className={`${sizeClasses[size]} border-2 border-white shadow-lg`}>
          <AvatarImage src={currentAvatar} alt={userName} />
          <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
            {currentAvatar ? <User className={buttonSizes[size]} /> : getInitials(userName)}
          </AvatarFallback>
        </Avatar>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="secondary"
              className="absolute -bottom-1 -right-1 rounded-full p-1.5 h-auto shadow-md group-hover:shadow-lg transition-shadow"
            >
              <Camera className={buttonSizes[size]} />
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Profilbild ändern</DialogTitle>
              <DialogDescription>
                Laden Sie ein neues Profilbild hoch. Es wird automatisch auf einen Kreis zugeschnitten.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <ImageCropper
                onImageCropped={handleImageCropped}
                currentImage={currentAvatar}
                size={200}
              />
              
              {tempAvatar && (
                <div className="flex flex-col items-center space-y-2">
                  <p className="text-sm font-medium">Vorschau:</p>
                  <Avatar className="w-20 h-20 border-2 border-muted">
                    <AvatarImage src={tempAvatar} alt="Vorschau" />
                    <AvatarFallback>
                      <User className="w-8 h-8" />
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={handleCancel}>
                Abbrechen
              </Button>
              <Button onClick={handleSave} disabled={!tempAvatar}>
                Speichern
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        className="text-xs text-muted-foreground h-auto p-1"
        onClick={() => setIsDialogOpen(true)}
      >
        Bild ändern
      </Button>
    </div>
  );
}