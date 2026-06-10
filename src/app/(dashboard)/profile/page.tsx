'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Award, 
  Leaf, 
  Target, 
  Trophy, 
  Compass, 
  Calculator,
  Loader2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profileStats, setProfileStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfileStats() {
      setIsLoading(true);
      try {
        // Fetch records
        const recordsRes = await fetch('/api/calculator');
        const records = await recordsRes.json();
        
        // Fetch goals
        const goalsRes = await fetch('/api/goals');
        const goals = await goalsRes.json();
        
        // Fetch challenges
        const challengesRes = await fetch('/api/challenges');
        const challenges = await challengesRes.json();

        // Calculate statistics
        const totalCalculations = records.length;
        const latestRecord = records[0] || null;
        
        const activeGoals = goals.filter((g: any) => !g.isCompleted).length;
        const completedGoals = goals.filter((g: any) => g.isCompleted).length;
        
        const completedChallenges = challenges.filter((c: any) => c.isCompleted).length;

        const annualEmissions = latestRecord ? latestRecord.annualEmissions : 0;
        const sustainabilityScore = latestRecord
          ? Math.max(10, Math.min(100, Math.round(100 - (annualEmissions / 1000 - 2) * 8)))
          : 0;

        setProfileStats({
          totalCalculations,
          latestRecord,
          activeGoals,
          completedGoals,
          completedChallenges,
          sustainabilityScore,
          annualEmissions,
        });
      } catch (err) {
        console.error('Failed to load profile stats:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (session) {
      loadProfileStats();
    }
  }, [session]);

  if (isLoading || !session) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  // Get user rank based on sustainability score
  const getEcoRank = (score: number) => {
    if (score >= 80) return { title: 'Eco Warrior', desc: 'Incredible! Your carbon footprint is close to or matches sustainable targets.', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20' };
    if (score >= 50) return { title: 'Green Cadet', desc: 'Good work! You have moderate footprint levels, with minor adjustments needed.', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20' };
    return { title: 'Carbon Apprentice', desc: 'Starting out! Your emissions are high. Log calculator sheets to build reductions.', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20' };
  };

  const rank = getEcoRank(profileStats.sustainabilityScore);

  return (
    <div className="space-y-8 py-4">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          My Profile
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Review your sustainability status, achievements, and account details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Card */}
        <Card className="bg-white dark:bg-slate-900 border border-slate-205 lg:col-span-1">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-50 dark:bg-slate-800 text-emerald-600 border border-emerald-100 dark:border-slate-700">
              <User className="h-10 w-10" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{session.user?.name}</h3>
              <p className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5 mt-1">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>{session.user?.email}</span>
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 text-center flex items-center justify-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Climate citizen since June 2026</span>
            </div>
          </CardContent>
        </Card>

        {/* Achievement Rank & Metrics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Rank Card */}
          <Card className="bg-white dark:bg-slate-900 border border-slate-205">
            <CardContent className="pt-6 flex flex-col sm:flex-row items-center gap-6">
              <div className={`h-16 w-16 rounded-xl flex items-center justify-center shrink-0 ${rank.color}`}>
                <Award className="h-8 w-8" />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                  <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider">Current Eco Ranking:</span>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${rank.color}`}>
                    {rank.title}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {rank.desc}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="bg-white dark:bg-slate-900 border border-slate-205">
              <CardContent className="pt-6 text-center">
                <Calculator className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                <span className="block text-2xl font-extrabold text-slate-900 dark:text-white">
                  {profileStats.totalCalculations}
                </span>
                <span className="text-2xs text-slate-400 font-bold uppercase">Carbon Logs</span>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border border-slate-205">
              <CardContent className="pt-6 text-center">
                <Target className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                <span className="block text-2xl font-extrabold text-slate-900 dark:text-white">
                  {profileStats.completedGoals}
                </span>
                <span className="text-2xs text-slate-400 font-bold uppercase">Goals Met</span>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border border-slate-205">
              <CardContent className="pt-6 text-center">
                <Trophy className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                <span className="block text-2xl font-extrabold text-slate-900 dark:text-white">
                  {profileStats.completedChallenges}
                </span>
                <span className="text-2xs text-slate-400 font-bold uppercase">Challenges Met</span>
              </CardContent>
            </Card>
          </div>

          {/* Profile Summary Info */}
          <Card className="bg-white dark:bg-slate-900 border border-slate-205">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-1.5 text-slate-900 dark:text-white">
                <Compass className="h-5 w-5 text-emerald-600" />
                <span>Ecological Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-3 leading-relaxed text-slate-600 dark:text-slate-400">
              {profileStats.latestRecord ? (
                <>
                  <p>
                    Your latest evaluation indicates a total footprint of{' '}
                    <strong className="text-slate-900 dark:text-white">
                      {Math.round(profileStats.latestRecord.monthlyEmissions)} kg CO2 equivalent per month
                    </strong>
                    .
                  </p>
                  <p>
                    This puts you at an annual rate of{' '}
                    <strong className="text-slate-900 dark:text-white">
                      {Math.round(profileStats.annualEmissions / 1000 * 10) / 10} tonnes
                    </strong>{' '}
                    per year. To align with global emission targets necessary to combat climate change, work to reduce your score below 2.0 tonnes.
                  </p>
                </>
              ) : (
                <p>
                  You haven&apos;t recorded a carbon footprint calculation yet. Visit the Carbon Calculator to determine your score.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
