import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { registerSchema } from '@/schemas/auth.schema';
import { useRegister } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/layout/Logo';

export default function RegisterPage() {
  const registerUser = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = handleSubmit((values) => registerUser.mutate(values));

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-navy)] px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <h1 className="text-xl font-bold text-center text-[var(--color-navy)]">Create your account</h1>
        <p className="text-sm text-center text-gray-400 mt-1 mb-6">Share your moments with the world 🧡</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="johndoe" {...register('username')} />
            {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Minimal 6 karakter" {...register('password')} />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={registerUser.isPending}>
            {registerUser.isPending ? 'Creating account...' : 'Register'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Udah punya akun?{' '}
          <Link to="/login" className="font-semibold text-[var(--color-orange)] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
