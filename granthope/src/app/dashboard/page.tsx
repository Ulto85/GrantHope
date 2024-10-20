'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Heart, Building2, Search, ExternalLink, Loader2 } from 'lucide-react';
// Sample data for demo purposes
const sampleResults = [
    {
      text: "VHL Research Grant Program - Offering support for innovative research projects focused on von Hippel-Lindau disease mechanisms, treatments, and potential cures.",
      approximateRange: "$50,000 - $100,000",
      deadline: "March 15, 2025",
      isValid: true,
      url: "https://example.com/vhl-research-grant"
    },
    {
      text: "Rare Disease Treatment Innovation Grant - Supporting organizations working on rare genetic conditions including VHL syndrome.",
      approximateRange: "$75,000 - $150,000",
      deadline: "June 30, 2025",
      isValid: true,
      url: "https://example.com/rare-disease-grant"
    },
    {
      text: "Patient Support Program Development Grant - Funding for nonprofits to establish or expand support services for VHL patients and families.",
      approximateRange: "$25,000 - $50,000",
      deadline: "September 1, 2025",
      isValid: true,
      url: "https://example.com/patient-support-grant"
    }
   ];

// Set this to true for demo mode
const USE_SAMPLE_DATA = true;

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
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 p-8">
    <div className="max-w-6xl mx-auto">
      <nav className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <Heart className="text-blue-600 h-8 w-8" />
          <h1 className="text-3xl font-bold">Grant<span className="text-blue-600">Hope</span></h1>
        </div>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </nav>
   
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="text-blue-600 h-5 w-5" />
              <CardTitle>Organization Profile</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="NGO Name"
                className="h-12"
                value={ngoData.name}
                onChange={(e) => setNgoData({...ngoData, name: e.target.value})}
              />
              <Input
                placeholder="Disease Focus"
                className="h-12"
                value={ngoData.disease}
                onChange={(e) => setNgoData({...ngoData, disease: e.target.value})}
              />
              <Textarea
                placeholder="NGO Mission"
                className="min-h-[100px]"
                value={ngoData.mission}
                onChange={(e) => setNgoData({...ngoData, mission: e.target.value})}
              />
              <Textarea
                placeholder="Description"
                className="min-h-[100px]"
                value={ngoData.description}
                onChange={(e) => setNgoData({...ngoData, description: e.target.value})}
              />
              <Input
                placeholder="Location"
                className="h-12"
                value={ngoData.location}
                onChange={(e) => setNgoData({...ngoData, location: e.target.value})}
              />
              <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Find Grants
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
   
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Available <span className="text-blue-600">Grants</span></h2>
          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result, i) => (
                <Card key={i} className="hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="font-medium text-lg">{result.text}</div>
                      {result.isValid && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          Highly Relevant
                        </span>
                      )}
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-gray-600 text-sm mb-4">
                      <div>Range: {result.approximateRange}</div>
                      <div>Deadline: {result.deadline}</div>
                    </div>
                    {result.url && (
                      <Button 
                        variant="outline" 
                        className="hover:bg-blue-50"
                        onClick={() => window.open(result.url, '_blank')}
                      >
                        View Grant <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-blue-50 border-none">
              <CardContent className="p-12 text-center">
                <Search className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No Grants Found Yet</h3>
                <p className="text-gray-600">Update your organization profile and search for matching grants</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
   </div>
  );
}