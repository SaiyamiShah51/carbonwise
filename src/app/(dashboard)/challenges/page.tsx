'use client';

import { useEffect, useState } from 'react';
import { 
  Trophy, 
  CheckCircle, 
  HelpCircle,
  TrendingUp,
  AlertCircle,
  Flame,
  Zap,
  Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ChallengeData {
  _id: string;
  challengeId: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  progress: number;
  isCompleted: boolean;
  completedAt?: string;
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeData | null>(null);
  const [progressVal, setProgressVal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function fetchChallenges() {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/challenges');
      if (!response.ok) throw new Error('Failed to load challenges');
      const data = await response.json();
      setChallenges(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred retrieving challenges');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchChallenges();
  }, []);

  const openUpdateModal = (challenge: ChallengeData) => {
    setSelectedChallenge(challenge);
    setProgressVal(challenge.progress);
    setIsUpdateOpen(true);
  };

  const handleUpdateProgressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallenge) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/challenges/${selectedChallenge._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress: Number(progressVal) }),
      });

      if (!response.ok) throw new Error('Failed to update progress');
      
      setIsUpdateOpen(false);
      setSelectedChallenge(null);
      fetchChallenges();
    } catch (err: any) {
      alert(err.message || 'Failed to update challenge progress');
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickComplete = async (challenge: ChallengeData) => {
    try {
      const response = await fetch(`/api/challenges/${challenge._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress: 100 }),
      });

      if (!response.ok) throw new Error('Failed to complete challenge');
      fetchChallenges();
    } catch (err: any) {
      alert(err.message || 'Failed to complete challenge');
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Eco Challenges
          </h1>
          <p className="text-slate-505 text-slate-650 text-slate-500 dark:text-slate-400 mt-1">
            Build sustainable habits by joining and completing carbon-conscious challenges.
          </p>
        </div>
        
        {/* Trophies Counter */}
        <div className="flex items-center space-x-2 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border border-amber-100 dark:border-amber-900/30 py-2.5 px-5 rounded-xl self-start sm:self-center shrink-0">
          <Trophy className="h-5 w-5 text-amber-500 animate-pulse" />
          <span className="text-sm font-extrabold">
            {challenges.filter((c) => c.isCompleted).length} / {challenges.length} Solved
          </span>
        </div>
      </div>

      {error && (
        <Alert variant="error">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {challenges.map((challenge) => {
            const diffColor = 
              challenge.difficulty === 'Hard'
                ? 'bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30'
                : challenge.difficulty === 'Medium'
                ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30'
                : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30';

            return (
              <Card 
                key={challenge._id} 
                className={`bg-white dark:bg-slate-900 border transition-all hover:shadow-md ${
                  challenge.isCompleted 
                    ? 'border-emerald-500 dark:border-emerald-600/40 bg-emerald-50/10' 
                    : 'border-slate-205'
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider">{challenge.category}</span>
                    <span className={`text-2xs font-extrabold px-2 py-0.5 rounded-full ${diffColor}`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <CardTitle className="text-base font-bold flex items-center gap-1.5 leading-snug">
                    {challenge.isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Flame className="h-4 w-4 text-amber-500 shrink-0" />
                    )}
                    <span>{challenge.title}</span>
                  </CardTitle>
                  <CardDescription className="text-xs mt-1 leading-relaxed">
                    {challenge.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span>Progress: {challenge.progress}%</span>
                      {challenge.isCompleted && challenge.completedAt && (
                        <span>Done on {new Date(challenge.completedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                    <Progress value={challenge.progress} />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {!challenge.isCompleted && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openUpdateModal(challenge)}
                          className="font-bold flex items-center space-x-1"
                        >
                          <span>Adjust Progress</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => quickComplete(challenge)}
                          className="font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:hover:bg-emerald-950/45 flex items-center space-x-1"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Instantly Complete</span>
                        </Button>
                      </>
                    )}
                    {challenge.isCompleted && (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        <span>Completed (100% Saved)</span>
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Adjust Progress Modal */}
      <Dialog
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        title="Update Challenge Progress"
      >
        {selectedChallenge && (
          <form onSubmit={handleUpdateProgressSubmit} className="space-y-6">
            <div className="space-y-1 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
              <span className="block text-2xs text-slate-400 font-bold uppercase tracking-wider">{selectedChallenge.category}</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{selectedChallenge.title}</h4>
              <p className="text-xs text-slate-500 leading-snug">{selectedChallenge.description}</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-650">
                <span>Drag to adjust progress value:</span>
                <span className="text-emerald-600 dark:text-emerald-500 font-extrabold text-sm">{progressVal}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={progressVal}
                onChange={(e) => setProgressVal(Number(e.target.value))}
                className="w-full h-2 bg-slate-205 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
              />
              <div className="flex justify-between text-2xs text-slate-400">
                <span>0% Started</span>
                <span>50% Midpoint</span>
                <span>100% Completed</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUpdateOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="font-bold flex items-center gap-1.5"
                isLoading={isSubmitting}
              >
                <Zap className="h-4 w-4" />
                <span>Save Progress</span>
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}
