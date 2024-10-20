'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Building2, Target, Lock } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 p-4">
    <Card className="w-[700px] p-6">
      <CardHeader>
        <div className="flex justify-center mb-6">
          <Heart className="text-blue-600 h-12 w-12" />
        </div>
        <div className="text-3xl font-bold text-center">Join <span className="text-blue-600">GrantHope</span></div>
        <p className="text-gray-600 text-center mt-2">Start connecting with the perfect grants for your mission</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg mb-6">
            <Building2 className="text-blue-600 h-5 w-5" />
            <p className="text-sm text-gray-600">Organization Details</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Organization Name"
                className="h-12"
                value={user.organizationName}
                onChange={(e) => setUser({...user, organizationName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                className="h-12"
                value={user.email}
                onChange={(e) => setUser({...user, email: e.target.value})}
              />
            </div>
          </div>
   
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Disease Focus"
              className="h-12"
              value={user.disease}
              onChange={(e) => setUser({...user, disease: e.target.value})}
            />
          </div>
   
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
            <Target className="text-blue-600 h-5 w-5" />
            <p className="text-sm text-gray-600">Mission & Description</p>
          </div>
   
          <Textarea
            placeholder="Organization Mission"
            className="min-h-[100px]"
            value={user.mission}
            onChange={(e) => setUser({...user, mission: e.target.value})}
          />
          <Textarea
            placeholder="Organization Description"
            className="min-h-[100px]"
            value={user.description}
            onChange={(e) => setUser({...user, description: e.target.value})}
          />
   
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
            <Lock className="text-blue-600 h-5 w-5" />
            <p className="text-sm text-gray-600">Security Details</p>
          </div>
   
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="Location"
              className="h-12"
              value={user.location}
              onChange={(e) => setUser({...user, location: e.target.value})}
            />
            <Input
              type="password"
              placeholder="Password"
              className="h-12"
              value={user.password}
              onChange={(e) => setUser({...user, password: e.target.value})}
            />
          </div>
   
          <Input
            type="password"
            placeholder="Confirm Password"
            className="h-12"
            value={user.confirmPassword}
            onChange={(e) => setUser({...user, confirmPassword: e.target.value})}
          />
   
          <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700">
            Create Account
          </Button>
          
          <div className="text-center text-gray-600">
            Already have an account? <Link href="/login" className="text-blue-600 hover:underline font-medium">Login</Link>
          </div>
        </form>
      </CardContent>
    </Card>
   </div>
  );
}