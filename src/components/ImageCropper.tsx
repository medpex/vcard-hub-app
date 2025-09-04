import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Upload, Crop, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageCropperProps {
  onImageCropped: (croppedImage: string) => void;
  currentImage?: string;
  size?: number;
}

export function ImageCropper({ onImageCropped, currentImage, size = 200 }: ImageCropperProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(currentImage || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [zoom, setZoom] = useState([1]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Ungültiger Dateityp",
        description: "Bitte wählen Sie eine Bilddatei aus.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Datei zu groß",
        description: "Das Bild darf maximal 5MB groß sein.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setZoom([1]);
      setPosition({ x: 0, y: 0 });
      setImageLoaded(false);
    };
    reader.readAsDataURL(file);
  }, [toast]);

  // Load image and set up preview
  useEffect(() => {
    if (!selectedImage || !previewCanvasRef.current) return;

    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
      imageRef.current = img;
      drawPreview();
    };
    img.src = selectedImage;
  }, [selectedImage]);

  // Redraw preview when zoom or position changes
  useEffect(() => {
    if (imageLoaded) {
      drawPreview();
    }
  }, [zoom, position, imageLoaded]);

  const drawPreview = useCallback(() => {
    if (!previewCanvasRef.current || !imageRef.current) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, size, size);

    // Calculate the minimum dimension to ensure the image covers the circle
    const minDimension = Math.min(img.width, img.height);
    const scale = zoom[0] * (size / minDimension);
    
    // Calculate scaled dimensions
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    
    // Calculate position with zoom
    const centerX = size / 2;
    const centerY = size / 2;
    const drawX = centerX - scaledWidth / 2 + position.x;
    const drawY = centerY - scaledHeight / 2 + position.y;

    // Draw image
    ctx.drawImage(img, drawX, drawY, scaledWidth, scaledHeight);

    // Create circular clipping path for preview
    ctx.save();
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Draw circular border
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    ctx.stroke();
  }, [zoom, position, size]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragStart({ 
      x: e.clientX - rect.left - position.x, 
      y: e.clientY - rect.top - position.y 
    });
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragStart.x;
    const newY = e.clientY - rect.top - dragStart.y;
    
    // Limit dragging to keep image within reasonable bounds
    const maxOffset = size * 0.5;
    setPosition({
      x: Math.max(-maxOffset, Math.min(maxOffset, newX)),
      y: Math.max(-maxOffset, Math.min(maxOffset, newY))
    });
  }, [isDragging, dragStart, size]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const cropToCircle = useCallback(() => {
    if (!selectedImage || !canvasRef.current || !imageRef.current) return;

    setIsProcessing(true);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = imageRef.current;
      canvas.width = size;
      canvas.height = size;

      // Clear canvas
      ctx.clearRect(0, 0, size, size);

      // Calculate the minimum dimension to ensure the image covers the circle
      const minDimension = Math.min(img.width, img.height);
      const scale = zoom[0] * (size / minDimension);
      
      // Calculate scaled dimensions
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      
      // Calculate position with zoom
      const centerX = size / 2;
      const centerY = size / 2;
      const drawX = centerX - scaledWidth / 2 + position.x;
      const drawY = centerY - scaledHeight / 2 + position.y;

      // Create circular clipping path
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.clip();

      // Draw image with zoom and position
      ctx.drawImage(img, drawX, drawY, scaledWidth, scaledHeight);

      ctx.restore();

      // Convert to base64
      const croppedImage = canvas.toDataURL('image/jpeg', 0.8);
      onImageCropped(croppedImage);
      setIsProcessing(false);

      toast({
        title: "Bild zugeschnitten",
        description: "Das Profilbild wurde erfolgreich zugeschnitten.",
      });
    } catch (error) {
      console.error('Error cropping image:', error);
      setIsProcessing(false);
      toast({
        title: "Fehler",
        description: "Das Bild konnte nicht verarbeitet werden.",
        variant: "destructive",
      });
    }
  }, [selectedImage, zoom, position, onImageCropped, size, toast]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setSelectedImage(null);
    setZoom([1]);
    setPosition({ x: 0, y: 0 });
    setImageLoaded(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {selectedImage ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative flex justify-center">
                <canvas
                  ref={previewCanvasRef}
                  width={size}
                  height={size}
                  className="border-2 border-blue-400 rounded-full cursor-move"
                  style={{ width: `${size}px`, height: `${size}px` }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
              </div>

              {/* Zoom controls */}
              <div className="w-full max-w-xs space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ZoomOut className="w-4 h-4" />
                    Zoom
                  </span>
                  <span className="flex items-center gap-1">
                    <ZoomIn className="w-4 h-4" />
                    {Math.round(zoom[0] * 100)}%
                  </span>
                </div>
                <Slider
                  value={zoom}
                  onValueChange={setZoom}
                  max={3}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={cropToCircle} 
                  disabled={isProcessing || !imageLoaded}
                  className="flex items-center gap-2"
                >
                  <Crop className="w-4 h-4" />
                  {isProcessing ? "Bearbeite..." : "Zuschneiden"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Zurücksetzen
                </Button>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                Verwenden Sie den Schieberegler zum Zoomen und ziehen Sie das Bild zum Positionieren.
                Das Bild wird in einen Kreis zugeschnitten.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-2 border-muted hover:border-blue-400 transition-colors cursor-pointer">
          <CardContent 
            className="flex flex-col items-center justify-center py-12 px-6"
            onClick={handleUploadClick}
          >
            <Upload className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Profilbild hochladen</h3>
            <p className="text-muted-foreground text-center mb-4">
              Klicken Sie hier oder ziehen Sie ein Bild hinein
            </p>
            <Button>
              Bild auswählen
            </Button>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Unterstützte Formate: JPG, PNG, GIF (max. 5MB)
            </p>
          </CardContent>
        </Card>
      )}

      {/* Hidden canvas for cropping */}
      <canvas
        ref={canvasRef}
        className="hidden"
        width={size}
        height={size}
      />
    </div>
  );
}