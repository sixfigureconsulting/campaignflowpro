import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Palette, Upload } from "lucide-react";
import { useState } from "react";

interface CustomizationPanelProps {
  onColorChange: (color: string) => void;
  onLogoChange: (logo: string) => void;
  currentColor: string;
}

export const CustomizationPanel = ({ onColorChange, onLogoChange, currentColor }: CustomizationPanelProps) => {
  const [color, setColor] = useState(currentColor);
  const [logoPreview, setLogoPreview] = useState<string>("");

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onColorChange(newColor);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
