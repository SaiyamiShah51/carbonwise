'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calculator, 
  Car, 
  Home, 
  ShoppingBag, 
  CheckCircle2, 
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog } from '@/components/ui/dialog';

export default function CalculatorPage() {
  const router = useRouter();
  
  // Form values
  const [vehicleType, setVehicleType] = useState('none');
  const [dailyTravelDistance, setDailyTravelDistance] = useState('0');
  const [fuelUsage, setFuelUsage] = useState('0');
  const [publicTransportUsage, setPublicTransportUsage] = useState('0');
  
  const [electricityConsumption, setElectricityConsumption] = useState('0');
  const [waterUsage, setWaterUsage] = useState('0');
  
  const [foodHabits, setFoodHabits] = useState('average');
  const [shoppingFrequency, setShoppingFrequency] = useState('medium');
  const [wasteGeneration, setWasteGeneration] = useState('0');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const vehicleOptions = [
    { value: 'none', label: 'No private vehicle' },
    { value: 'petrol', label: 'Petrol car' },
    { value: 'diesel', label: 'Diesel car' },
    { value: 'hybrid', label: 'Hybrid vehicle' },
    { value: 'electric', label: 'Electric vehicle (EV)' },
    { value: 'motorcycle', label: 'Motorcycle / Scooter' },
  ];

  const foodOptions = [
    { value: 'meat-heavy', label: 'Meat-Heavy (Beef, pork, poultry daily)' },
    { value: 'average', label: 'Average (Mixed meat, dairy, vegetables)' },
    { value: 'vegetarian', label: 'Vegetarian (No meat, eggs/dairy included)' },
    { value: 'vegan', label: 'Vegan (Strictly plant-based)' },
  ];

  const shoppingOptions = [
    { value: 'high', label: 'Frequent (Frequent new clothes, electronics, goods)' },
    { value: 'medium', label: 'Moderate (Standard shopping, replacement items)' },
    { value: 'low', label: 'Minimal (Only buy essential replacement goods)' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessData(null);

    // Validations
    if (
      Number(dailyTravelDistance) < 0 || 
      Number(fuelUsage) < 0 || 
      Number(publicTransportUsage) < 0 || 
      Number(electricityConsumption) < 0 || 
      Number(waterUsage) < 0 || 
      Number(wasteGeneration) < 0
    ) {
      setError('Numerical inputs cannot be negative');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleType,
          dailyTravelDistance: Number(dailyTravelDistance),
          fuelUsage: Number(fuelUsage),
          publicTransportUsage: Number(publicTransportUsage),
          electricityConsumption: Number(electricityConsumption),
          waterUsage: Number(waterUsage),
          foodHabits,
          shoppingFrequency,
          wasteGeneration: Number(wasteGeneration),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to compute carbon calculations');
      } else {
        setSuccessData(data);
        setIsModalOpen(true);
      }
    } catch (err) {
      setError('An error occurred posting your carbon log. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Redirect to insights or dashboard
    router.push('/dashboard');
    router.refresh();
  };

  const triggerInsights = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/insights', {
        method: 'POST',
      });
      if (response.ok) {
        router.push('/insights');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Carbon Footprint Calculator
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Complete the questionnaire below to calculate your daily, monthly, and annual carbon emissions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <Alert variant="error">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section 1: Travel & Transportation */}
          <Card className="bg-white dark:bg-slate-900 border border-slate-205">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <CardTitle className="text-base font-bold flex items-center space-x-2 text-emerald-600 dark:text-emerald-500">
                <Car className="h-5 w-5" />
                <span>1. Travel & Commuting</span>
              </CardTitle>
              <CardDescription className="text-xs">Your vehicle type and daily travel distances.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <Select
                label="Primary Vehicle Type"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                options={vehicleOptions}
              />
              
              {vehicleType !== 'none' && (
                <>
                  <Input
                    label="Daily Vehicle Distance (km)"
                    type="number"
                    min="0"
                    step="any"
                    value={dailyTravelDistance}
                    onChange={(e) => setDailyTravelDistance(e.target.value)}
                    required
                  />
                  {['petrol', 'diesel'].includes(vehicleType) && (
                    <Input
                      label="Monthly Fuel Usage (Liters)"
                      type="number"
                      min="0"
                      step="any"
                      value={fuelUsage}
                      onChange={(e) => setFuelUsage(e.target.value)}
                      required
                    />
                  )}
                </>
              )}

              <Input
                label="Daily Public Transport (Bus, Train, Metro - km)"
                type="number"
                min="0"
                step="any"
                value={publicTransportUsage}
                onChange={(e) => setPublicTransportUsage(e.target.value)}
                required
              />
            </CardContent>
          </Card>

          {/* Section 2: Home Utilities */}
          <Card className="bg-white dark:bg-slate-900 border border-slate-205">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <CardTitle className="text-base font-bold flex items-center space-x-2 text-emerald-600 dark:text-emerald-500">
                <Home className="h-5 w-5" />
                <span>2. Home Utilities</span>
              </CardTitle>
              <CardDescription className="text-xs">Electricity and water metrics for your household.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <Input
                label="Monthly Electricity Use (kWh)"
                type="number"
                min="0"
                step="any"
                value={electricityConsumption}
                onChange={(e) => setElectricityConsumption(e.target.value)}
                required
              />
              <Input
                label="Average Daily Water Use (Liters)"
                type="number"
                min="0"
                step="any"
                value={waterUsage}
                onChange={(e) => setWaterUsage(e.target.value)}
                required
              />
            </CardContent>
          </Card>

          {/* Section 3: Lifestyle & Diet */}
          <Card className="bg-white dark:bg-slate-900 border border-slate-205">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <CardTitle className="text-base font-bold flex items-center space-x-2 text-emerald-600 dark:text-emerald-500">
                <ShoppingBag className="h-5 w-5" />
                <span>3. Lifestyle & Consumption</span>
              </CardTitle>
              <CardDescription className="text-xs">Dietary choices, shopping, and waste volumes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <Select
                label="Food & Dietary Habits"
                value={foodHabits}
                onChange={(e) => setFoodHabits(e.target.value)}
                options={foodOptions}
              />
              <Select
                label="Shopping Frequency (Non-essentials)"
                value={shoppingFrequency}
                onChange={(e) => setShoppingFrequency(e.target.value)}
                options={shoppingOptions}
              />
              <Input
                label="Weekly Household Waste Produced (kg)"
                type="number"
                min="0"
                step="any"
                value={wasteGeneration}
                onChange={(e) => setWasteGeneration(e.target.value)}
                required
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto font-bold flex items-center space-x-2 shadow-md"
            isLoading={isLoading}
          >
            <Calculator className="h-5 w-5" />
            <span>Calculate Footprint</span>
          </Button>
        </div>
      </form>

      {/* Success Dialog Modal showing calculation outputs */}
      <Dialog
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Calculation Summary"
      >
        {successData && (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <CheckCircle2 className="h-14 w-14 text-emerald-500 animate-bounce" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Emissions Computed Successfully!</h3>
              <p className="text-sm text-slate-500">Your carbon entries have been stored in the database.</p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                <span className="block text-xs text-slate-400 font-bold uppercase">Daily</span>
                <span className="block text-lg font-extrabold text-slate-900 dark:text-white">{successData.dailyEmissions}</span>
                <span className="text-2xs text-slate-500">kg CO2</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                <span className="block text-xs text-slate-400 font-bold uppercase">Monthly</span>
                <span className="block text-lg font-extrabold text-slate-900 dark:text-white">{successData.monthlyEmissions}</span>
                <span className="text-2xs text-slate-500">kg CO2</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                <span className="block text-xs text-slate-400 font-bold uppercase">Annual</span>
                <span className="block text-lg font-extrabold text-slate-900 dark:text-white">
                  {Math.round(successData.annualEmissions / 1000 * 10) / 10}
                </span>
                <span className="text-2xs text-slate-500">tonnes</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                className="flex-1 font-semibold"
                onClick={handleModalClose}
              >
                Go to Dashboard
              </Button>
              <Button
                className="flex-1 font-bold flex items-center justify-center space-x-1.5"
                onClick={triggerInsights}
                isLoading={isLoading}
              >
                <TrendingDown className="h-4 w-4" />
                <span>Get AI Insights</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
