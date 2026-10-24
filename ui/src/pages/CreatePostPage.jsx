import { useEffect, useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { SendHorizonal, X, ImageIcon, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createPostSchema } from '@/schemas/post.schema';
import { useCreatePost, usePost, useUpdatePost } from '@/hooks/usePosts';
import { useCategories } from '@/hooks/useCategories';
import { useAuthStore } from '@/stores/authStore';
import { uploadApi } from '@/api/upload.api';
import { getApiErrorMessage } from '@/api/axios';
import { API_BASE_URL } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

const CAPTION_MAX = 2200;

export default function CreatePostPage() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const fileInputRef = useRef(null);

  const { data: existingPost, isLoading: postLoading } = usePost(isEditMode ? id : undefined);
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost(id ?? '');

  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createPostSchema),
    defaultValues: { caption: '', imageUrl: '', categoryId: undefined },
  });

  const caption = watch('caption') ?? '';
  const imageUrl = watch('imageUrl');

  // Guard kepemilikan: cegah user mengedit post milik orang lain
  useEffect(() => {
    if (isEditMode && existingPost && user) {
      const isOwner = existingPost.userId === user.id;
      const isAdmin = user.role === 'admin';
      if (!isOwner && !isAdmin) {
        toast.error('Anda tidak memiliki izin untuk mengedit post ini');
        navigate('/', { replace: true });
      }
    }
  }, [isEditMode, existingPost, user, navigate]);

  // Isi ulang form kalau lagi mode edit dan data post-nya sudah terbaca
  useEffect(() => {
    if (isEditMode && existingPost) {
      reset({
        caption: existingPost.caption ?? '',
        imageUrl: existingPost.imageUrl ?? '',
        categoryId: existingPost.categoryId,
      });
      setImagePreview(existingPost.imageUrl ?? '');
    }
  }, [isEditMode, existingPost, reset]);

  useEffect(() => {
    setImagePreview(imageUrl ?? '');
  }, [imageUrl]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const data = await uploadApi.uploadImage(file);
      const fullUrl = data.fileUrl.startsWith('http') ? data.fileUrl : `${API_BASE_URL}${data.fileUrl}`;
      setValue('imageUrl', fullUrl, { shouldValidate: true });
      setImagePreview(fullUrl);
      toast.success('Foto berhasil diunggah!');
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const isSubmitting = createPost.isPending || updatePost.isPending;

  const onSubmit = handleSubmit((values) => {
    const payload = {
      caption: values.caption || undefined,
      imageUrl: values.imageUrl || undefined,
      categoryId: Number(values.categoryId),
    };

    if (isEditMode && id) {
      updatePost.mutate(payload, { onSuccess: () => navigate('/') });
    } else {
      createPost.mutate(payload, { onSuccess: () => navigate('/') });
    }
  });

  if (isEditMode && postLoading) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <Skeleton className="h-10 w-64 mx-auto" />
        <Skeleton className="aspect-video w-full" />
      </div>
    );
  }

  if (isEditMode && existingPost && user && existingPost.userId !== user.id && user.role !== 'admin') {
    return null;
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-navy)]">{isEditMode ? 'Edit post' : 'Create new post'}</h1>
        <p className="text-sm text-gray-400 mt-1">Share your moments with the world 🧡</p>
      </div>

      <form onSubmit={onSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 space-y-6">
        <div className="space-y-3">
          <Label>Foto / Gambar</Label>
          
          {/* Hidden file input untuk Multer upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileUpload}
          />

          {imagePreview ? (
            <div className="relative overflow-hidden rounded-xl border border-gray-200">
              <img
                src={imagePreview}
                alt="Preview"
                className="aspect-video w-full object-cover"
                onError={() => setImagePreview('')}
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview('');
                  setValue('imageUrl', '');
                }}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-600 hover:bg-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center aspect-video w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-400 gap-3">
              <ImageIcon className="h-10 w-10 text-gray-300" />
              <div>
                <p className="text-sm font-medium text-gray-600">Unggah foto atau masukkan URL</p>
                <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WebP, atau GIF (Maks. 5MB)</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="mt-1"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Mengunggah...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" /> Pilih Foto dari Perangkat
                  </>
                )}
              </Button>
            </div>
          )}

          <div className="space-y-1">
            <span className="text-xs text-gray-400">Atau gunakan URL gambar langsung:</span>
            <Input placeholder="https://example.com/photo.jpg" {...register('imageUrl')} />
          </div>
          {errors.imageUrl && <p className="text-xs text-red-500">{errors.imageUrl.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="caption">Write a caption</Label>
          <Textarea id="caption" rows={4} placeholder="Morning view never gets old ✨" {...register('caption')} />
          <div className="flex justify-between items-center">
            {errors.caption ? (
              <p className="text-xs text-red-500">{errors.caption.message}</p>
            ) : (
              <span />
            )}
            <span className="text-xs text-gray-400">
              {caption.length}/{CAPTION_MAX}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Choose a category</Label>
          {categoriesLoading ? (
            <Skeleton className="h-11 w-full" />
          ) : (
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Select value={field.value ? String(field.value) : undefined} onValueChange={(v) => field.onChange(Number(v))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          )}
          {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId.message}</p>}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || isUploading}>
          <SendHorizonal className="h-4 w-4" />
          {isSubmitting ? 'Sharing...' : isEditMode ? 'Save changes' : 'Share'}
        </Button>
      </form>
    </div>
  );
}
