import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { updateProfileSchema } from '@/schemas/profile.schema';
import { useUpdateProfile } from '@/hooks/useProfile';
import { useState } from 'react';

export function EditProfileDialog({ profile }) {
  const [open, setOpen] = useState(false);
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: profile.fullName ?? '',
      bio: profile.bio ?? '',
      avatarUrl: profile.avatarUrl ?? '',
    },
  });

  const onSubmit = handleSubmit((values) => {
    updateProfile.mutate(values, { onSuccess: () => setOpen(false) });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" placeholder="Nama lengkap kamu" {...register('fullName')} />
            {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="avatarUrl">Avatar URL</Label>
            <Input id="avatarUrl" placeholder="https://..." {...register('avatarUrl')} />
            {errors.avatarUrl && <p className="text-xs text-red-500">{errors.avatarUrl.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" placeholder="Ceritain tentang diri kamu..." rows={3} {...register('bio')} />
            {errors.bio && <p className="text-xs text-red-500">{errors.bio.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
