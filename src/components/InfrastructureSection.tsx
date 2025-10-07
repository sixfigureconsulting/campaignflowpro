import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Server, Save } from "lucide-react";
import { useState } from "react";

interface InfrastructureSectionProps {
  onInfrastructureUpdate: (infrastructure: { totalMailboxes: number; totalLinkedInAccounts: number }) => void;
}

export const InfrastructureSection = ({ onInfrastructureUpdate }: InfrastructureSectionProps) => {
  const [totalMailboxes, setTotalMailboxes] = useState(5);
  const [totalLinkedInAccounts, setTotalLinkedInAccounts] = useState(2);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onInfrastructureUpdate({ totalMailboxes, totalLinkedInAccounts });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <Card className="shadow-primary-md border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="w-5 h-5 text-primary" />
          Infrastructure Available
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalMailboxes">Total Mailboxes</Label>
            <Input
              id="totalMailboxes"
              type="number"
              value={totalMailboxes}
              onChange={(e) => setTotalMailboxes(parseInt(e.target.value) || 0)}
              className="text-lg font-semibold"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalLinkedInAccounts">Total LinkedIn Accounts</Label>
            <Input
              id="totalLinkedInAccounts"
              type="number"
              value={totalLinkedInAccounts}
              onChange={(e) => setTotalLinkedInAccounts(parseInt(e.target.value) || 0)}
              className="text-lg font-semibold"
            />
          </div>
        </div>
        <Button onClick={handleSave} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          {isSaved ? 'Infrastructure Saved!' : 'Save Infrastructure'}
        </Button>
      </CardContent>
    </Card>
  );
};