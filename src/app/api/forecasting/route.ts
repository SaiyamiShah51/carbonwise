import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { CarbonRecord } from '@/lib/models/carbon-record';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Fetch user records ordered by date ascending to build chronological trend
    const records = await CarbonRecord.find({ userId: session.user.id })
      .sort({ createdAt: 1 });

    if (records.length === 0) {
      return NextResponse.json({
        hasHistory: false,
        forecast: [],
        suggestion: 'Please complete your first carbon calculation to generate forecasts.',
      });
    }

    // Prepare history data in monthly totals
    const historyData = records.map((r) => ({
      date: new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      emissions: r.monthlyEmissions, // in kg CO2
    }));

    // Perform linear projection
    const n = records.length;
    let slope = 0;
    const latestEmissions = records[n - 1].monthlyEmissions;

    if (n > 1) {
      // Calculate simple regression slope: y = mx + c
      let sumX = 0;
      let sumY = 0;
      let sumXY = 0;
      let sumXX = 0;

      for (let i = 0; i < n; i++) {
        sumX += i;
        sumY += records[i].monthlyEmissions;
        sumXY += i * records[i].monthlyEmissions;
        sumXX += i * i;
      }

      // m = (N*sumXY - sumX*sumY) / (N*sumXX - sumX^2)
      const denominator = n * sumXX - sumX * sumX;
      if (denominator !== 0) {
        slope = (n * sumXY - sumX * sumY) / denominator;
      }
    }

    // Generate forecast points (Next 3 months)
    const forecast = [];
    const dateNames = ['Month +1', 'Month +2', 'Month +3'];

    for (let i = 1; i <= 3; i++) {
      // Project using slope, capped at a minimum of 50 kg CO2 (since a human has a base footprint)
      const index = n - 1 + i;
      const projected = Math.max(50, Math.round((latestEmissions + slope * i) * 100) / 100);
      forecast.push({
        month: dateNames[i - 1],
        projectedEmissions: projected,
      });
    }

    // Generate custom text advice based on slope
    let suggestion = '';
    const roundedSlopeVal = Math.round(Math.abs(slope));

    if (slope < -5) {
      suggestion = `Your carbon footprint is decreasing by approximately ${roundedSlopeVal} kg CO2 per entry! Your recent efforts are paying off. Continue executing your daily challenges to lock in these reductions.`;
    } else if (slope > 5) {
      suggestion = `Your carbon footprint is showing an upward trend, increasing by about ${roundedSlopeVal} kg CO2 per entry. Review your travel distance or electric energy settings in the calculator to identify what changed.`;
    } else {
      suggestion = 'Your carbon footprint has stabilized. Try taking on a high-difficulty eco-challenge, like a Meat-Free diet, or installing faucet aerators to force a downward trend.';
    }

    return NextResponse.json({
      hasHistory: true,
      slope,
      history: historyData,
      forecast,
      suggestion,
    });
  } catch (error: any) {
    console.error('Fetch carbon forecast error:', error);
    return NextResponse.json({ error: 'Failed to generate carbon forecast' }, { status: 500 });
  }
}
