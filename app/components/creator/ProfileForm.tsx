'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UploadDropzone } from '@/app/lib/uploadthing';
import { updateProfile } from '@/app/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { GetStripeDashboardLink } from '@/app/actions';

interface ProfileFormProps {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    username?: string | null;
    bio?: string | null;
    avatarUrl?: string | null;
    connectedAccountId: string;
    stripeConnectedLinked: boolean;
  };
}

export function ProfileForm({ user: initialUser }: ProfileFormProps) {
  const router = useRouter();
  const [state, formAction] = useFormState(updateProfile, null);
  const [user, setUser] = useState(initialUser);
  const [avatarUploading, setAvatarUploading] = useState(false);

  if (state?.status === 'success') {
    toast.success('Profile updated successfully!');
    router.refresh();
  }

  if (state?.status === 'error') {
    toast.error(state.message || 'Failed to update profile');
  }

  const handleAvatarUpload = (res: Array<{ url: string }>) => {
    if (res && res.length > 0) {
      setUser({ ...user, avatarUrl: res[0].url });
      setAvatarUploading(false);
    }
  };

  const handleStripeConnect = async () => {
    try {
      await GetStripeDashboardLink();
    } catch (error) {
      toast.error('Failed to open Stripe dashboard');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your public profile information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <input type="hidden" name="userId" value={user.id} />
            <input type="hidden" name="avatarUrl" value={user.avatarUrl || ''} />

            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                name="username"
                defaultValue={user.username || ''}
                placeholder="your-username"
                pattern="[a-z0-9-]+"
                required
              />
              <p className="text-xs text-muted-foreground">
                Only lowercase letters, numbers, and hyphens. Used in your public profile URL.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={user.bio || ''}
                placeholder="Tell us about yourself..."
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {(user.bio || '').length}/500 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label>Avatar</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatarUrl || ''} alt={user.firstName} />
                  <AvatarFallback>
                    {user.firstName[0]}{user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={handleAvatarUpload}
                    onUploadError={() => {
                      setAvatarUploading(false);
                      toast.error('Failed to upload avatar');
                    }}
                    onUploadBegin={() => setAvatarUploading(true)}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={avatarUploading}>
              {avatarUploading ? 'Uploading...' : 'Update Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stripe Connect</CardTitle>
          <CardDescription>
            Manage your payment account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Account Status</span>
            {user.stripeConnectedLinked ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">Connected</span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">Not connected</span>
            )}
          </div>

          {user.stripeConnectedLinked ? (
            <Button onClick={handleStripeConnect} variant="outline" className="w-full">
              Open Stripe Dashboard
            </Button>
          ) : (
            <form action={GetStripeDashboardLink}>
              <Button type="submit" className="w-full">
                Connect Stripe Account
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
