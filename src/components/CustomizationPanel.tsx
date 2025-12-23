import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Palette, Upload } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const MAX_LOGO_SIZE_MB = 2;
const MAX_LOGO_SIZE_BYTES = MAX_LOGO_SIZE_MB * 1024 * 1024;

interface CustomizationPanelProps {
  onColorChange: (color: string) => void;
  onLogoChange: (logo: string) => void;
  onClientNameChange: (name: string) => void;
  currentColor: string;
  currentClientName: string;
  currentLogo: string;
}

export const CustomizationPanel = ({ 
  onColorChange, 
  onLogoChange, 
  onClientNameChange,
  currentColor,
  currentClientName,
  currentLogo 
}: CustomizationPanelProps) => {
  const [color, setColor] = useState(currentColor);
  const [clientName, setClientName] = useState(currentClientName);
  const [logoPreview, setLogoPreview] = useState<string>(currentLogo);
  const { toast } = useToast();

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onColorChange(newColor);
  };

  const handleClientNameChange = (newName: string) => {
    setClientName(newName);
    onClientNameChange(newName);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > MAX_LOGO_SIZE_BYTES) {
        toast({
          title: "File too large",
          description: `Logo must be less than ${MAX_LOGO_SIZE_MB}MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB.`,
          variant: "destructive",
        });
        // Reset the input
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        onLogoChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="shadow-primary-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          Customize Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="clientName">Client Name</Label>
          <Input
            id="clientName"
            type="text"
            value={clientName}
            onChange={(e) => handleClientNameChange(e.target.value)}
            placeholder="Enter client name"
            className="text-lg font-semibold"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brandColor">Brand Color</Label>
          <div className="flex gap-2">
            <Input
              id="brandColor"
              type="color"
              value={color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-20 h-10 cursor-pointer"
            />
            <Input
              type="text"
              value={color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="flex-1"
              placeholder="#4F46E5"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo">Company Logo</Label>
          <div className="flex gap-2 items-center">
            <Button variant="outline" className="relative" asChild>
              <label htmlFor="logo" className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Upload Logo
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
            </Button>
            {logoPreview && (
              <img src={logoPreview} alt="Logo preview" className="h-10 w-auto rounded" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
