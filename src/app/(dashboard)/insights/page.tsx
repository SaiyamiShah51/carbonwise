'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Lightbulb, 
  RefreshCw, 
  CheckSquare, 
  AlertTriangle, 
  HelpCircle,
  Leaf,
  Plus
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Recommendation {
  title: string;
  description: string;
  category: string;
  impactLevel: 'High' | 'Medium' | 'Low';
}

interface WeeklyGoal {
  title: string;
  targetValue: number;
  unit: string;
}

interface InsightData {
  analysis: string;
  majorSources: string[];
  recommendations: Recommendation[];
  weeklyGoals: WeeklyGoal[];
  createdAt: string;
}

export default function InsightsPage() {
  const [insight, setInsight] = useState<InsightData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [noCalculatorData, setNoCalculatorData] = useState(false);

  async function fetchInsight() {
    setIsLoading(true);
    setError('');
    setNoCalculatorData(false);
    try {
      const response = await fetch('/api/insights');
      if (response.status === 404) {
        setNoCalculatorData(true);
      } else if (!response.ok) {
        throw new Error('Failed to retrieve AI insights');
      } else {
        const data = await response.json();
        setInsight(data);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred fetching sustainability advice');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchInsight();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');
    try {
      const response = await fetch('/api/insights', {
        method: 'POST',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze carbon data');
      }
      setInsight(data);
      setNoCalculatorData(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred triggering Gemini AI analysis');
    } finally {
      setIsGenerating(false);
    }
  };

  const addWeeklyGoalToTracker = async (goal: WeeklyGoal) => {
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Reduce ${goal.title}`,
          description: `AI-Suggested Weekly Target: ${goal.targetValue} ${goal.unit}`,
          category: 'General',
          targetValue: goal.targetValue,
          currentValue: 0,
          unit: goal.unit,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        }),
      });

      if (response.ok) {
        alert('Suggested weekly goal successfully imported to your Goals Tracker!');
      } else {
        const d = await response.json();
        alert(`Failed to add goal: ${d.error}`);
      }
    } catch (err) {
      alert('Failed to add goal due to network issue.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse py-6">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4" />
        <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-60 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-60 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            AI Sustainability Insights
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Personalized, machine-learning carbon reduction plans powered by Google Gemini.
          </p>
        </div>
        {!noCalculatorData && (
          <Button
            onClick={handleGenerate}
            isLoading={isGenerating}
            variant="outline"
            className="flex items-center space-x-1.5 font-bold cursor-pointer shrink-0"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Regenerate Insights</span>
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="error">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Analysis Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {noCalculatorData ? (
        <Card className="border-dashed border-slate-350 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-8 text-center max-w-xl mx-auto">
          <CardHeader className="justify-center">
            <div className="mx-auto bg-amber-100 p-3 rounded-full text-amber-600 mb-2">
              <Lightbulb className="h-6 w-6" />
            </div>
            <CardTitle>Calculator Data Needed</CardTitle>
            <CardDescription>
              Gemini requires at least one carbon calculation log to generate an emissions analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/calculator">
              <Button className="font-bold">Complete First Calculation</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        insight && (
          <div className="space-y-8">
            {/* AI Analysis Block */}
            <Card className="bg-emerald-600 text-white border-none shadow-md overflow-hidden relative">
              <div className="absolute right-0 top-0 opacity-10 translate-x-6 -translate-y-6">
                <Lightbulb className="h-60 w-60" />
              </div>
              <CardContent className="p-6 md:p-8 space-y-4 relative z-10">
                <h3 className="text-lg font-extrabold flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-emerald-200" />
                  <span>Gemini Emissions Assessment</span>
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-emerald-50">
                  {insight.analysis}
                </p>
                {insight.createdAt && (
                  <p className="text-xs text-emerald-200 pt-2">
                    Generated on {new Date(insight.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Hotspots & Weekly Goals grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Hotspots Card */}
              <Card className="bg-white dark:bg-slate-900 border border-slate-205">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center space-x-2 text-rose-600 dark:text-rose-500">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Emissions Hotspots</span>
                  </CardTitle>
                  <CardDescription className="text-xs">Your primary categories of environmental impact.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-2">
                  {insight.majorSources.map((source, index) => (
                    <div key={index} className="flex items-start gap-3 bg-rose-50 dark:bg-rose-950/20 p-3 rounded-lg border border-rose-100 dark:border-rose-900/30">
                      <span className="flex items-center justify-center h-5 w-5 rounded-full bg-rose-600 text-white text-xs font-bold shrink-0 mt-0.5 select-none">
                        {index + 1}
                      </span>
                      <p className="text-xs font-bold text-slate-805 text-slate-800 dark:text-slate-200">{source}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Weekly Goals Card */}
              <Card className="bg-white dark:bg-slate-900 border border-slate-205">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center space-x-2 text-emerald-600 dark:text-emerald-500">
                    <CheckSquare className="h-5 w-5" />
                    <span>AI Suggested Weekly Goals</span>
                  </CardTitle>
                  <CardDescription className="text-xs">Actionable targets to work on this week.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
                  {insight.weeklyGoals.map((goal, index) => (
                    <div key={index} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-3.5 rounded-lg border border-slate-100 dark:border-slate-700">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{goal.title}</h4>
                        <span className="text-2xs text-slate-400 font-semibold uppercase">
                          Target: {goal.targetValue} {goal.unit}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => addWeeklyGoalToTracker(goal)}
                        className="font-bold flex items-center space-x-1 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/20"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add</span>
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Custom Recommendations List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Actionable Reduction Plan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {insight.recommendations.map((rec, index) => {
                  const impactColor = 
                    rec.impactLevel === 'High' 
                      ? 'bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30' 
                      : rec.impactLevel === 'Medium' 
                      ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30' 
                      : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30';

                  return (
                    <Card key={index} className="bg-white dark:bg-slate-900 border border-slate-205 flex flex-col justify-between hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{rec.category}</span>
                          <span className={`text-2xs font-extrabold px-2 py-0.5 rounded-full ${impactColor}`}>
                            {rec.impactLevel} Impact
                          </span>
                        </div>
                        <CardTitle className="text-base font-bold leading-snug">{rec.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                          {rec.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
