'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { Heart, ArrowRight, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify(credentials));
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50">
 <Card className="w-[450px] p-6">
   <CardHeader>
     <div className="flex justify-center mb-6">
       <Heart className="text-blue-600 h-12 w-12" />
     </div>
     <div className="text-3xl font-bold text-center">Welcome Back to <span className="text-blue-600">GrantHope</span></div>
     <p className="text-gray-600 text-center mt-2">Continue your mission of making a difference</p>
   </CardHeader>
   <CardContent>
     <form onSubmit={handleSubmit} className="space-y-6">
       <div className="space-y-2">
         <Input
           type="email"
           placeholder="Email"
           className="h-12"
           value={credentials.email}
           onChange={(e) => setCredentials({...credentials, email: e.target.value})}
         />
       </div>
       <div className="space-y-2">
         <Input
           type="password"
           placeholder="Password"
           className="h-12"
           value={credentials.password}
           onChange={(e) => setCredentials({...credentials, password: e.target.value})}
         />
       </div>
       <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700">
         Sign In
       </Button>
       <div className="text-center text-gray-600">
         Don't have an account? <Link href="/register" className="text-blue-600 hover:underline font-medium">Register</Link>
       </div>
     </form>
   </CardContent>
 </Card>
</div>
  );
}