'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  CheckCircle2, 
  Sliders, 
  HelpCircle,
  Moon,
  Sun
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  
  // Settings values
  const [name, setName] = useState(session?.user?.name || '');
  const [email, setEmail] = useState(session?.user?.email || '');
  const [unitSystem, setUnitSystem] = useState('metric');
  
  const [emailDigest, setEmailDigest] = useState(true);
  const [challengeReminders, setChallengeReminders] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const unitOptions = [
    { value: 'metric', label: 'Metric (Kilometers, Liters, Kilograms)' },
    { value: 'imperial', label: 'Imperial (Miles, Gallons, Pounds)' },
  ];

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess('');
    setError('');

    if (!name || !email) {
      setError('Name and email cannot be blank');
      setIsLoading(false);
      return;
    }

    try {
      // Mock saving user details to database (in real apps you would call PUT /api/user)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSuccess('Account settings saved successfully!');
    } catch (err) {
      setError('An error occurred saving settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess('');
    setError('');

    try {
      // Save preferences mock
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSuccess('Preferences updated successfully!');
    } catch (err) {
      setError('Failed to update preferences.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="text-slate-505 text-slate-650 text-slate-500 dark:text-slate-400 mt-1">
          Adjust preferences, measurement units, and manage your account.
        </p>
      </div>

      {success && (
        <Alert variant="success">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <AlertDescription className="font-semibold">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="error">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation / Intro card */}
        <div className="space-y-4 lg:col-span-1">
          <Card className="bg-white dark:bg-slate-900 border border-slate-205">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                <Sliders className="h-5 w-5" />
                <span>Quick Configurations</span>
              </div>
              <p className="text-xs text-slate-505 text-slate-500 leading-relaxed">
                Configure your CarbonWise dashboard settings. Toggle between Metric or Imperial measurement systems, set weekly email digests, or modify credentials.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Configurations Fields */}
        <div className="lg:col-span-2 space-y-8">
          {/* Account Profile Settings */}
          <Card className="bg-white dark:bg-slate-900 border border-slate-205">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <CardTitle className="text-base font-bold flex items-center space-x-2 text-slate-900 dark:text-white">
                <User className="h-5 w-5 text-emerald-600" />
                <span>Account Profile</span>
              </CardTitle>
              <CardDescription className="text-xs">Update your credentials and details.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleAccountSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" isLoading={isLoading} className="font-bold">
                    Save Account
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Preferences Settings */}
          <Card className="bg-white dark:bg-slate-900 border border-slate-205">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <CardTitle className="text-base font-bold flex items-center space-x-2 text-slate-900 dark:text-white">
                <Settings className="h-5 w-5 text-emerald-600" />
                <span>Application Preferences</span>
              </CardTitle>
              <CardDescription className="text-xs">Manage system settings and notifications.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handlePreferencesSubmit} className="space-y-6">
                <Select
                  label="Measurement Unit System"
                  value={unitSystem}
                  onChange={(e) => setUnitSystem(e.target.value)}
                  options={unitOptions}
                />

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Notifications</h4>
                  
                  <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="block text-xs font-bold text-slate-900 dark:text-white">Weekly Email Digests</span>
                      <span className="text-2xs text-slate-400">Receive weekly summaries of your footprint reductions and goals.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailDigest}
                      onChange={(e) => setEmailDigest(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <span className="block text-xs font-bold text-slate-900 dark:text-white">Challenge Reminders</span>
                      <span className="text-2xs text-slate-400">Receive alerts about active eco challenges nearing deadlines.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={challengeReminders}
                      onChange={(e) => setChallengeReminders(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Button type="submit" isLoading={isLoading} className="font-bold">
                    Save Preferences
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
