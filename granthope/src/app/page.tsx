'use client';
'use client';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Heart, BarChart3, Clock, Target } from 'lucide-react'; 
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
    <div className="container mx-auto px-4">
      <nav className="py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Heart className="text-blue-600" />
          <h1 className="text-2xl font-bold">GrantHope</h1>
        </div>
        <div className="space-x-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
          </Link>
        </div>
      </nav>
  
      <main className="py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl font-bold mb-6">
            Find Grants for Your
            <span className="text-blue-600"> Rare Disease</span> Nonprofit
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Stop spending hours searching for funding. Let GrantHope connect you with 
            <span className="text-blue-600 font-medium"> relevant grants</span> so you can focus on what matters most - your mission.
          </p>
  
          <div className="grid md:grid-cols-3 gap-8 mt-16">
 <Card className="p-8 hover:shadow-lg transition-all text-center">
   <div className="flex justify-center">
     <BarChart3 className="h-12 w-12 text-blue-600 mb-6" />
   </div>
   <h3 className="text-xl font-bold mb-3">Smart <span className="text-blue-600">Search</span></h3>
   <p className="text-gray-600">AI-powered grant matching tailored to your organization</p>
 </Card>
 
 <Card className="p-8 hover:shadow-lg transition-all text-center">
   <div className="flex justify-center">
     <Target className="h-12 w-12 text-blue-600 mb-6" />
   </div>
   <h3 className="text-xl font-bold mb-3">Time <span className="text-blue-600">Saving</span></h3>
   <p className="text-gray-600">Automated screening saves hours of manual searching</p>
 </Card>
 
 <Card className="p-8 hover:shadow-lg transition-all text-center">
   <div className="flex justify-center">
     <Clock className="h-12 w-12 text-blue-600 mb-6" />
   </div>
   <h3 className="text-xl font-bold mb-3">Focused <span className="text-blue-600">Results</span></h3>
   <p className="text-gray-600">Only see grants that match your specific needs</p>
 </Card>
</div>
        </div>
      </main>
    </div>
  </div>
  );
}
