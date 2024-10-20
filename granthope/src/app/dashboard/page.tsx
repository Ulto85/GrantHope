'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ExternalLink } from "lucide-react";

// Sample data for demo purposes
const SAMPLE_GRANTS = [
  {
    text: "The Rare Disease Foundation Research Grant",
    approximateRange: "$50,000 - $100,000",
    deadline: "Opens January 2025",
    url: "https://example.com/grant1"
  },
  {
    text: "Global Genes RARE Patient Impact Grant",
    approximateRange: "$25,000 - $75,000",
    deadline: "Opens March 2025",
    url: "https://example.com/grant2"
  },
  {
    text: "Chan Zuckerberg Initiative Rare Disease Research",
    approximateRange: "$150,000 - $300,000",
    deadline: "Rolling Applications",
    url: "https://example.com/grant3"
  }
];

// Set this to true for demo mode
const USE_SAMPLE_DATA = false;

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [ngoData, setNgoData] = useState({
    name: '',
    description: '',
    disease: '',
    mission: '',
    location: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(userData);
    setNgoData({
      name: user.organizationName,
      description: user.description,
      disease: user.disease,
      mission: user.mission,
      location: user.location
    });
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (USE_SAMPLE_DATA) {
      setTimeout(() => {
        setResults(SAMPLE_GRANTS);
        setLoading(false);
      }, 1500); // Simulate API delay
      return;
    }

    try {
      const context = `NGO Name: ${ngoData.name}. Focus Disease: ${ngoData.disease}. 
        Mission: ${ngoData.mission}. Description: ${ngoData.description}. Location: ${ngoData.location}`;
      
      const userData = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({
        ...userData,
        organizationName: ngoData.name,
        description: ngoData.description,
        disease: ngoData.disease,
        mission: ngoData.mission,
        location: ngoData.location
      }));

      const promptResponse = await fetch('http://127.0.0.1:8003/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: context })
      });
      const { prompts } = await promptResponse.json();
      
      const searchPromises = prompts.slice(0, 5).map(prompt =>
        fetch('http://127.0.0.1:8001/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: prompt })
        }).then(res => res.json())
      );
      
      const searchResults = await Promise.all(searchPromises);
      
      const validationPromises = searchResults.flatMap(result =>
        (result.urls || []).slice(0, 5).map(async url => {
          const response = await fetch('http://127.0.0.1:8002/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ link: url, context })
          });
          const data = await response.json();
          return { ...data, url }; // Include the URL in the result
        })
      );
      
      const validatedResults = await Promise.all(validationPromises);
      setResults(validatedResults.filter(r => r.isValid));
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">GrantHope Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Update Organization Info & Find Grants</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="NGO Name"
                value={ngoData.name}
                onChange={(e) => setNgoData({...ngoData, name: e.target.value})}
              />
              <Input
                placeholder="Disease Focus"
                value={ngoData.disease}
                onChange={(e) => setNgoData({...ngoData, disease: e.target.value})}
              />
              <Textarea
                placeholder="NGO Mission"
                value={ngoData.mission}
                onChange={(e) => setNgoData({...ngoData, mission: e.target.value})}
              />
              <Textarea
                placeholder="Description"
                value={ngoData.description}
                onChange={(e) => setNgoData({...ngoData, description: e.target.value})}
              />
              <Input
                placeholder="Location"
                value={ngoData.location}
                onChange={(e) => setNgoData({...ngoData, location: e.target.value})}
              />
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Find Grants
              </Button>
            </form>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((result, i) => (
              <Card key={i}>
                <CardContent className="p-4 space-y-3">
                  <div className="font-medium">{result.text}</div>
                  <div className="text-sm text-slate-500">
                    Range: {result.approximateRange}
                  </div>
                  <div className="text-sm text-slate-500">
                    Deadline: {result.deadline}
                  </div>
                  {result.url && (
                    <Button variant="outline" size="sm" onClick={() => window.open(result.url, '_blank')}>
                      View Grant <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}