'use client';

import { useEffect, useState } from 'react';
import { 
  Target, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Calendar, 
  HelpCircle,
  TrendingDown,
  Edit2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Dialog } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface GoalData {
  _id: string;
  title: string;
  description: string;
  category: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  isCompleted: boolean;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<GoalData[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<GoalData | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [targetValue, setTargetValue] = useState('10');
  const [currentValue, setCurrentValue] = useState('0');
  const [unit, setUnit] = useState('kg CO2');
  const [deadline, setDeadline] = useState('');

  const categoryOptions = [
    { value: 'General', label: 'General / Miscellaneous' },
    { value: 'Travel', label: 'Travel & Transportation' },
    { value: 'Energy', label: 'Energy & Electricity' },
    { value: 'Food', label: 'Food & Diet' },
    { value: 'Water', label: 'Water Usage' },
    { value: 'Waste', label: 'Waste & Recycling' },
  ];

  async function fetchGoals() {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/goals');
      if (!response.ok) throw new Error('Failed to fetch goals');
      const data = await response.json();
      setGoals(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to retrieve goals from database');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !category || !targetValue || !deadline || !unit) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          targetValue: Number(targetValue),
          currentValue: Number(currentValue) || 0,
          unit,
          deadline,
        }),
      });

      if (!response.ok) {
        const d = await response.json();
        throw new Error(d.error || 'Failed to create goal');
      }

      setIsAddOpen(false);
      resetForm();
      fetchGoals();
    } catch (err: any) {
      setError(err.message || 'Error occurred creating goal');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal) return;

    try {
      const response = await fetch(`/api/goals/${selectedGoal._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentValue: Number(currentValue),
          title,
          description,
          category,
          targetValue: Number(targetValue),
          deadline,
        }),
      });

      if (!response.ok) {
        const d = await response.json();
        throw new Error(d.error || 'Failed to update goal');
      }

      setIsEditOpen(false);
      setSelectedGoal(null);
      resetForm();
      fetchGoals();
    } catch (err: any) {
      setError(err.message || 'Failed to update goal progress');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      const response = await fetch(`/api/goals/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete goal');
      fetchGoals();
    } catch (err: any) {
      alert(err.message || 'Error deleting goal');
    }
  };

  const openEditModal = (goal: GoalData) => {
    setSelectedGoal(goal);
    setTitle(goal.title);
    setDescription(goal.description || '');
    setCategory(goal.category);
    setTargetValue(goal.targetValue.toString());
    setCurrentValue(goal.currentValue.toString());
    setUnit(goal.unit);
    // Format date string to YYYY-MM-DD for input
    const dateStr = new Date(goal.deadline).toISOString().split('T')[0];
    setDeadline(dateStr);
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('General');
    setTargetValue('10');
    setCurrentValue('0');
    setUnit('kg CO2');
    setDeadline('');
  };

  const filteredGoals = goals.filter((g) => {
    if (filter === 'active') return !g.isCompleted;
    if (filter === 'completed') return g.isCompleted;
    return true;
  });

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Goals Tracker
          </h1>
          <p className="text-slate-505 text-slate-650 text-slate-500 dark:text-slate-400 mt-1">
            Establish, monitor, and accomplish carbon reduction targets.
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsAddOpen(true);
          }}
          className="flex items-center space-x-1.5 font-bold cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Custom Goal</span>
        </Button>
      </div>

      {error && (
        <Alert variant="error">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filter and Content tabs */}
      <div className="flex items-center space-x-4 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`text-sm font-bold pb-2 border-b-2 px-1 transition-all ${
            filter === 'all'
              ? 'border-emerald-600 text-emerald-600 dark:border-emerald-500 dark:text-emerald-500'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          All Goals ({goals.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`text-sm font-bold pb-2 border-b-2 px-1 transition-all ${
            filter === 'active'
              ? 'border-emerald-600 text-emerald-600 dark:border-emerald-500 dark:text-emerald-500'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Active ({goals.filter((g) => !g.isCompleted).length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`text-sm font-bold pb-2 border-b-2 px-1 transition-all ${
            filter === 'completed'
              ? 'border-emerald-600 text-emerald-600 dark:border-emerald-500 dark:text-emerald-500'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Completed ({goals.filter((g) => g.isCompleted).length})
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      ) : filteredGoals.length === 0 ? (
        <div className="h-48 flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center bg-white dark:bg-slate-900">
          <Target className="h-8 w-8 text-slate-400 mb-2" />
          <p className="text-slate-500 mb-1">No goals found here.</p>
          <p className="text-xs text-slate-400">Click &apos;Add Custom Goal&apos; to create your first tracking metric!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGoals.map((goal) => {
            const progressVal = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));

            return (
              <Card key={goal._id} className="bg-white dark:bg-slate-900 border border-slate-200 shadow-sm relative overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider">{goal.category}</span>
                    {goal.isCompleted ? (
                      <span className="flex items-center gap-1 text-2xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full dark:bg-emerald-950/20 dark:text-emerald-400">
                        <CheckCircle className="h-3 w-3" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className="text-2xs font-bold text-slate-400 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Due {new Date(goal.deadline).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-base font-bold leading-snug">{goal.title}</CardTitle>
                  {goal.description && (
                    <CardDescription className="text-xs mt-0.5">{goal.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-semibold text-slate-550 dark:text-slate-400">
                      <span>Progress: {progressVal}%</span>
                      <span>
                        {goal.currentValue} / {goal.targetValue} {goal.unit}
                      </span>
                    </div>
                    <Progress value={progressVal} />
                    
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditModal(goal)}
                        className="text-slate-500 hover:text-slate-900 flex items-center space-x-1"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span>Update</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(goal._id)}
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center space-x-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      <Dialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Custom Goal"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Goal Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Eat vegan meals, Ride bike to work"
            required
          />
          <Input
            label="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Avoid beef for breakfast and lunch to cut footprint"
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Goal Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={categoryOptions}
            />
            <Input
              label="Unit of Measurement"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g., kg CO2, %, km, meals"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Target Goal Value"
              type="number"
              min="0"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              required
            />
            <Input
              label="Starting Progress Value"
              type="number"
              min="0"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              required
            />
          </div>
          <Input
            label="Deadline Date"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="font-bold">
              Save Goal
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Edit Goal Modal */}
      <Dialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Update Goal Progress"
      >
        {selectedGoal && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-1 bg-slate-50 dark:bg-slate-800 p-3.5 rounded-lg border border-slate-100 dark:border-slate-700">
              <span className="block text-2xs text-slate-400 font-bold uppercase tracking-wider">{selectedGoal.category}</span>
              <h4 className="text-sm font-bold text-slate-905 text-slate-900 dark:text-white leading-tight">{selectedGoal.title}</h4>
              <p className="text-xs text-slate-500 leading-snug">{selectedGoal.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Target Goal Value"
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                required
              />
              <Input
                label="Current Progress Value"
                type="number"
                min="0"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                required
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="font-bold">
                Update Goal
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}
