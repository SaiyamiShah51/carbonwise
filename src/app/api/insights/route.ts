import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Insight } from '@/lib/models/insight';
import { CarbonRecord } from '@/lib/models/carbon-record';
import { generateSustainabilityInsights } from '@/lib/gemini';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    // Find the latest insights for this user
    const latestInsight = await Insight.findOne({ userId: session.user.id })
      .sort({ createdAt: -1 });

    if (!latestInsight) {
      return NextResponse.json({ message: 'No insights found. Please calculate your carbon footprint first.' }, { status: 404 });
    }

    return NextResponse.json(latestInsight);
  } catch (error: any) {
    console.error('Fetch insights error:', error);
    return NextResponse.json({ error: 'Failed to fetch insights' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Fetch the latest Carbon Record of the user
    const latestRecord = await CarbonRecord.findOne({ userId: session.user.id })
      .sort({ createdAt: -1 });

    if (!latestRecord) {
      return NextResponse.json(
        { error: 'Please submit at least one carbon calculator record before requesting AI insights.' },
        { status: 400 }
      );
    }

    // Call Gemini to generate insights
    const aiData = await generateSustainabilityInsights(latestRecord);

    // Create and save to DB
    const newInsight = new Insight({
      userId: session.user.id,
      analysis: aiData.analysis,
      majorSources: aiData.majorSources,
      recommendations: aiData.recommendations,
      weeklyGoals: aiData.weeklyGoals,
    });

    await newInsight.save();

    return NextResponse.json(newInsight, { status: 201 });
  } catch (error: any) {
    console.error('Generate insights error:', error);
    return NextResponse.json({ error: 'Failed to generate sustainability insights' }, { status: 500 });
  }
}
