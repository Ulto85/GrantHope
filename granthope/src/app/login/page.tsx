'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from 'next/link';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify(credentials));
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-[400px]">
        <CardHeader>
          <div className="text-2xl font-bold text-center">Login to GrantHope</div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              />
            </div>
            <Button type="submit" className="w-full">Login</Button>
            <div className="text-center text-sm text-slate-600">
              Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Register</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}