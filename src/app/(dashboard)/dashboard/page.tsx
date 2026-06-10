'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Leaf, 
  TrendingDown, 
  Target, 
  Trophy, 
  Lightbulb, 
  Plus, 
  Compass, 
  AlertCircle 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import EmissionCharts from '@/components/EmissionCharts';

interface RecordData {
  dailyEmissions: number;
  monthlyEmissions: number;
  annualEmissions: number;
  vehicleType: string;
  dailyTravelDistance: number;
  fuelUsage: number;
  publicTransportUsage: number;
  electricityConsumption: number;
  waterUsage: number;
  foodHabits: string;
  shoppingFrequency: string;
  wasteGeneration: number;
  createdAt: string;
}

export default function DashboardPage() {
  const [records, setRecords] = useState<RecordData[]>([]);
  const [forecast, setForecast] = useState<any>(null);
  const [goalsCount, setGoalsCount] = useState({ active: 0, completed: 0 });
  const [challengesCount, setChallengesCount] = useState({ active: 0, completed: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      setError('');
      try {
        // Fetch records
        const recordsRes = await fetch('/api/calculator');
        if (!recordsRes.ok) throw new Error('Failed to load calculator data');
        const recordsData = await recordsRes.json();
        setRecords(recordsData);

        // Fetch forecasting
        const forecastRes = await fetch('/api/forecasting');
        if (forecastRes.ok) {
          const forecastData = await forecastRes.json();
          setForecast(forecastData);
        }

        // Fetch goals count
        const goalsRes = await fetch('/api/goals');
        if (goalsRes.ok) {
          const goalsData = await goalsRes.json();
          const active = goalsData.filter((g: any) => !g.isCompleted).length;
          const completed = goalsData.filter((g: any) => g.isCompleted).length;
          setGoalsCount({ active, completed });
        }

        // Fetch challenges count
        const challengesRes = await fetch('/api/challenges');
        if (challengesRes.ok) {
          const challengesData = await challengesRes.json();
          const active = challengesData.filter((c: any) => !c.isCompleted).length;
          const completed = challengesData.filter((c: any) => c.isCompleted).length;
          setChallengesCount({ active, completed });
        }

      } catch (err: any) {
        console.error(err);
        setError(err.message || 'An error occurred fetching dashboard analytics');
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse py-6">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
        <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Dashboard</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const latestRecord = records[0];
  
  // 1. Calculate Score Details
  const annualEmissionsTonnes = latestRecord ? (latestRecord.annualEmissions / 1000) : 0;
  const roundedAnnual = Math.round(annualEmissionsTonnes * 10) / 10;
  
  // Sustainability Score: 2 tonnes annual footprint -> 100. 15 tonnes -> 10.
  const sustainabilityScore = latestRecord
    ? Math.max(10, Math.min(100, Math.round(100 - (annualEmissionsTonnes - 2) * 8)))
    : 0;

  // 2. Calculate Reduction Progress (Earliest vs Latest)
  let reductionRate = 0;
  let hasReduction = false;
  if (records.length > 1) {
    const earliest = records[records.length - 1];
    const diff = earliest.monthlyEmissions - latestRecord.monthlyEmissions;
    reductionRate = Math.round((diff / earliest.monthlyEmissions) * 100);
    hasReduction = reductionRate > 0;
  }

  return (
    <div className="space-y-8 py-4">
      {/* Header banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Sustainability Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Welcome back! Here is your current carbon profile and reduction trends.
          </p>
        </div>
        <div className="flex space-x-2 shrink-0">
          <Link href="/calculator">
            <Button className="flex items-center space-x-1.5 font-bold">
              <Plus className="h-4 w-4" />
              <span>Log Footprint</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main KPI Stats Row */}
      {!latestRecord ? (
        <Card className="border-dashed border-slate-350 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-8 text-center max-w-xl mx-auto">
          <CardHeader className="justify-center">
            <div className="mx-auto bg-emerald-100 dark:bg-emerald-950/40 p-3 rounded-full text-emerald-600 mb-2">
              <Leaf className="h-6 w-6 animate-bounce" />
            </div>
            <CardTitle>Welcome to CarbonWise</CardTitle>
            <CardDescription>
              To get started, calculate your carbon footprint using our smart calculator.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/calculator">
              <Button className="font-bold">Go to Carbon Calculator</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* KPI 1: Annual Carbon Score */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Annual Footprint</p>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{roundedAnnual}</span>
                      <span className="text-sm font-semibold text-slate-500">Tonnes</span>
                    </div>
                  </div>
                  <span className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-500">
                    <Leaf className="h-5 w-5" />
                  </span>
                </div>
                <div className="mt-4 flex items-center space-x-1.5 text-xs">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    {Math.round(latestRecord.monthlyEmissions)} kg / month
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* KPI 2: Sustainability Score */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sustainability Index</p>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{sustainabilityScore}</span>
                      <span className="text-sm font-semibold text-slate-500">/ 100</span>
                    </div>
                  </div>
                  <span className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-500">
                    <Compass className="h-5 w-5" />
                  </span>
                </div>
                <div className="mt-4">
                  <Progress value={sustainabilityScore} className="h-1.5" />
                </div>
              </CardContent>
            </Card>

            {/* KPI 3: Reduction progress */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reduction Progress</p>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                        {records.length > 1 ? Math.abs(reductionRate) : 0}
                      </span>
                      <span className="text-sm font-semibold text-slate-505 text-slate-500">%</span>
                    </div>
                  </div>
                  <span className={`p-2 rounded-lg ${hasReduction ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'} dark:bg-slate-800/40`}>
                    <TrendingDown className="h-5 w-5" />
                  </span>
                </div>
                <div className="mt-4 text-xs font-medium text-slate-500">
                  {records.length > 1 ? (
                    <span>
                      {hasReduction ? 'Decrease' : 'Increase'} since first carbon check
                    </span>
                  ) : (
                    <span>Requires multiple entries to track</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* KPI 4: Active Goals & Challenges */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Activity Checklist</p>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white space-y-1">
                      <div className="flex items-center space-x-1">
                        <Target className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>{goalsCount.active} active goals</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Trophy className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        <span>{challengesCount.completed} completed challenges</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Forecasting banner/alert */}
          {forecast && forecast.hasHistory && (
            <Alert variant={forecast.slope < 0 ? 'success' : forecast.slope > 0 ? 'warning' : 'info'} className="border border-slate-200 shadow-sm">
              <Lightbulb className="h-4 w-4" />
              <AlertTitle className="font-bold flex items-center gap-1.5">
                <span>AI Carbon Projection Insight</span>
              </AlertTitle>
              <AlertDescription className="mt-1 leading-relaxed">
                {forecast.suggestion}
              </AlertDescription>
            </Alert>
          )}

          {/* Recharts Analytics Charts */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Emissions Analytics & Projections</h2>
            <EmissionCharts records={records} forecastData={forecast?.forecast} />
          </div>
        </>
      )}
    </div>
  );
}
