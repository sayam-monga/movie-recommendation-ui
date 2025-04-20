
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AuthCard = () => {
  const [activeTab, setActiveTab] = useState('signin');
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would handle actual authentication here
    toast.success(`Successfully ${activeTab === 'signin' ? 'signed in' : 'signed up'}`);
    navigate('/dashboard');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card p-8">
        <Tabs defaultValue="signin" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input type="text" placeholder="Username" required />
              </div>
              <div>
                <Input type="password" placeholder="Password" required />
              </div>
              <Button type="submit" className="primary-button w-full">
                Sign In
              </Button>
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button 
                    type="button"
                    onClick={() => setActiveTab('signup')} 
                    className="text-primaryAccent hover:underline"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input type="text" placeholder="Username" required />
              </div>
              <div>
                <Input type="email" placeholder="Email" required />
              </div>
              <div>
                <Input type="password" placeholder="Password" required />
              </div>
              <Button type="submit" className="primary-button w-full">
                Sign Up
              </Button>
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button 
                    type="button"
                    onClick={() => setActiveTab('signin')} 
                    className="text-primaryAccent hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthCard;
