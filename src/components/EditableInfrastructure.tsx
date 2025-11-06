import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, Mail, Linkedin } from 'lucide-react';
import { useInfrastructure } from '@/hooks/useInfrastructure';

interface EditableInfrastructureProps {
  projectId: string;
  infrastructure?: {
    mailboxes: number;
    linkedin_accounts: number;
  };
}

export function EditableInfrastructure({ projectId, infrastructure }: EditableInfrastructureProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [mailboxes, setMailboxes] = useState(infrastructure?.mailboxes?.toString() || '0');
  const [linkedinAccounts, setLinkedinAccounts] = useState(infrastructure?.linkedin_accounts?.toString() || '0');
  const { upsertInfrastructure } = useInfrastructure(projectId);

  // Update local state when infrastructure prop changes
  useEffect(() => {
    setMailboxes(infrastructure?.mailboxes?.toString() || '0');
    setLinkedinAccounts(infrastructure?.linkedin_accounts?.toString() || '0');
  }, [infrastructure?.mailboxes, infrastructure?.linkedin_accounts]);

  const handleSave = async () => {
    await upsertInfrastructure.mutateAsync({
      mailboxes: parseInt(mailboxes),
      linkedin_accounts: parseInt(linkedinAccounts),
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setMailboxes(infrastructure?.mailboxes?.toString() || '0');
    setLinkedinAccounts(infrastructure?.linkedin_accounts?.toString() || '0');
    setIsEditing(false);
  };

  return (
    <Card className="shadow-primary-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Infrastructure Setup</span>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mailboxes" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Number of Mailboxes
          </Label>
          {isEditing ? (
            <Input
              id="mailboxes"
              type="number"
              min="0"
              value={mailboxes}
              onChange={(e) => setMailboxes(e.target.value)}
              placeholder="10"
            />
          ) : (
            <div className="text-2xl font-bold">{infrastructure?.mailboxes || 0}</div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin" className="flex items-center gap-2">
            <Linkedin className="h-4 w-4" />
            Number of LinkedIn Accounts
          </Label>
          {isEditing ? (
            <Input
              id="linkedin"
              type="number"
              min="0"
              value={linkedinAccounts}
              onChange={(e) => setLinkedinAccounts(e.target.value)}
              placeholder="5"
            />
          ) : (
            <div className="text-2xl font-bold">{infrastructure?.linkedin_accounts || 0}</div>
          )}
        </div>

        {isEditing && (
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSave}
              disabled={upsertInfrastructure.isPending}
              className="flex-1"
            >
              <Save className="mr-2 h-4 w-4" />
              {upsertInfrastructure.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        )}

        <div className="text-xs text-muted-foreground pt-4 border-t">
          Total Infrastructure: {(parseInt(mailboxes) || 0) + (parseInt(linkedinAccounts) || 0)} accounts
        </div>
      </CardContent>
    </Card>
  );
}
