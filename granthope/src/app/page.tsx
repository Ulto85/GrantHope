'use client';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white">
      <div className="container mx-auto px-4">
        <nav className="py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">GrantHope</h1>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </nav>
        
        <main className="py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-5xl font-bold text-slate-900 mb-6">
              Find Grants for Your Rare Disease Nonprofit
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Stop spending hours searching for funding. Let GrantHope connect you with relevant grants so you can focus on what matters most - your mission.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card className="p-6">
                <h3 className="font-bold mb-2">Smart Search</h3>
                <p>AI-powered grant matching tailored to your organization</p>
              </Card>
              <Card className="p-6">
                <h3 className="font-bold mb-2">Time Saving</h3>
                <p>Automated screening saves hours of manual searching</p>
              </Card>
              <Card className="p-6">
                <h3 className="font-bold mb-2">Focused Results</h3>
                <p>Only see grants that match your specific needs</p>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}