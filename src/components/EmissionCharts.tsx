'use client';

import { useEffect, useState } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';

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

interface ChartProps {
  records: RecordData[];
  forecastData?: any[];
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

export default function EmissionCharts({ records, forecastData }: ChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-64 flex items-center justify-center text-sm text-slate-400">Loading charts...</div>;
  }

  if (records.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center bg-white dark:bg-slate-900">
        <p className="text-slate-500 mb-2">No historical carbon data available.</p>
        <p className="text-xs text-slate-400">Submit a calculation in the Carbon Calculator to see charts.</p>
      </div>
    );
  }

  // 1. Prepare Pie Chart Data (Category Breakdown of the LATEST record)
  const latest = records[0];
  
  // Calculate relative segments
  const transportDaily = (latest.dailyTravelDistance * (latest.vehicleType === 'electric' ? 0.05 : 0.18)) + ((latest.fuelUsage * 2.31) / 30);
  const transitDaily = latest.publicTransportUsage * 0.03;
  const energyDaily = (latest.electricityConsumption * 0.45) / 30;
  const waterDaily = latest.waterUsage * 0.0003;
  
  let dietDaily = 5.6; // Average
  if (latest.foodHabits === 'meat-heavy') dietDaily = 7.2;
  else if (latest.foodHabits === 'vegetarian') dietDaily = 3.8;
  else if (latest.foodHabits === 'vegan') dietDaily = 2.9;

  let shoppingDaily = 2.5; // Medium
  if (latest.shoppingFrequency === 'high') shoppingDaily = 5.0;
  else if (latest.shoppingFrequency === 'low') shoppingDaily = 0.5;

  const wasteDaily = (latest.wasteGeneration * 0.5) / 7;

  const pieData = [
    { name: 'Private Travel', value: Math.round((transportDaily + transitDaily) * 30) },
    { name: 'Utilities (Power/Water)', value: Math.round((energyDaily + waterDaily) * 30) },
    { name: 'Diet & Nutrition', value: Math.round(dietDaily * 30) },
    { name: 'Shopping & Waste', value: Math.round((shoppingDaily + wasteDaily) * 30) },
  ].filter(d => d.value > 0);

  // 2. Prepare Line Chart Data (Historical Trend, showing oldest to newest)
  const historyData = [...records].reverse().map((r, index) => ({
    name: `Entry ${index + 1}`,
    emissions: Math.round(r.monthlyEmissions),
    date: new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
  }));

  // 3. Prepare Forecasting Chart Data (Combining historical average with future projection)
  const historicalAvg = Math.round(records.reduce((acc, curr) => acc + curr.monthlyEmissions, 0) / records.length);
  const targetThreshold = 166; // ~2 tonnes per year = 166 kg CO2/month

  const forecastChartData = forecastData && forecastData.length > 0
    ? forecastData.map((f) => ({
        name: f.month,
        Projected: Math.round(f.projectedEmissions),
        Target: targetThreshold,
      }))
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Historical Trend Line Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Carbon Footprint Trend (Monthly Rate)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyData}>
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} label={{ value: 'kg CO2', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 11 } }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                itemStyle={{ color: '#10b981' }}
              />
              <Line type="monotone" dataKey="emissions" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} name="Monthly CO2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Breakdown Pie Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Latest Breakdown (kg CO2 / Month)</h3>
        <div className="h-64 flex flex-col sm:flex-row items-center justify-around">
          <div className="h-48 w-48 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 text-xs">
            {pieData.map((d, index) => (
              <div key={d.name} className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-slate-500 dark:text-slate-400 font-medium">{d.name}:</span>
                <span className="font-bold text-slate-900 dark:text-white">{d.value} kg</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Forecast & Projections Chart (Bar Chart) */}
      {forecastChartData.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm lg:col-span-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">3-Month Forecast Projection</h3>
          <p className="text-xs text-slate-550 dark:text-slate-400 mb-4">
            Comparison of your projected monthly carbon emissions against the global climate action target of 166 kg CO2e / month.
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecastChartData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} label={{ value: 'kg CO2', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 11 } }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Projected" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Projected Emissions" />
                <Bar dataKey="Target" fill="#10b981" radius={[4, 4, 0, 0]} name="Sustainable Target (2-Ton/Yr Limit)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
