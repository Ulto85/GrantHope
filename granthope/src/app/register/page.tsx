'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from 'next/link';

export default function RegisterPage() {
  const [user, setUser] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    disease: '',
    mission: '',
    description: '',
    location: ''
  });
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    localStorage.setItem('user', JSON.stringify(user));
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-[600px]">
        <CardHeader>
          <div className="text-2xl font-bold text-center">Create an Account</div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Organization Name"
              value={user.organizationName}
              onChange={(e) => setUser({...user, organizationName: e.target.value})}
            />
            <Input
              type="email"
              placeholder="Email"
              value={user.email}
              onChange={(e) => setUser({...user, email: e.target.value})}
            />
            <Input
              type="text"
              placeholder="Disease Focus"
              value={user.disease}
              onChange={(e) => setUser({...user, disease: e.target.value})}
            />
            <Textarea
              placeholder="Organization Mission"
              value={user.mission}
              onChange={(e) => setUser({...user, mission: e.target.value})}
            />
            <Textarea
              placeholder="Organization Description"
              value={user.description}
              onChange={(e) => setUser({...user, description: e.target.value})}
            />
            <Input
              type="text"
              placeholder="Location"
              value={user.location}
              onChange={(e) => setUser({...user, location: e.target.value})}
            />
            <Input
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) => setUser({...user, password: e.target.value})}
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={user.confirmPassword}
              onChange={(e) => setUser({...user, confirmPassword: e.target.value})}
            />
            <Button type="submit" className="w-full">Register</Button>
            <div className="text-center text-sm text-slate-600">
              Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}