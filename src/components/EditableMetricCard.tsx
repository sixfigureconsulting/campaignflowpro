import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Edit2 } from "lucide-react";
import { useState } from "react";

interface EditableMetricCardProps {
  title: string;
  value: number;
  onChange: (value: number) => void;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const EditableMetricCard = ({ title, value, onChange, subtitle, icon }: EditableMetricCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());

  const handleSave = () => {
    const numValue = parseInt(editValue) || 0;
    onChange(numValue);
    setIsEditing(false);
  };

  return (
    <Card className="shadow-primary-md hover:shadow-primary-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <Input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="text-2xl font-bold h-12"
              autoFocus
            />
          ) : (
            <>
              <div className="text-3xl font-bold">{value.toLocaleString()}</div>
              <button
                onClick={() => {
                  setIsEditing(true);
                  setEditValue(value.toString());
                }}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
};
