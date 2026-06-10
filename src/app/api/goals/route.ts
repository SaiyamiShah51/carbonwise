import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Goal } from '@/lib/models/goal';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const goals = await Goal.find({ userId: session.user.id }).sort({ createdAt: -1 });

    return NextResponse.json(goals);
  } catch (error: any) {
    console.error('Fetch goals error:', error);
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, category, targetValue, currentValue, unit, deadline } = await req.json();

    if (!title || !category || targetValue === undefined || !deadline || !unit) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    const newGoal = new Goal({
      userId: session.user.id,
      title,
      description,
      category,
      targetValue: Number(targetValue),
      currentValue: Number(currentValue) || 0,
      unit,
      deadline: new Date(deadline),
      isCompleted: (Number(currentValue) || 0) >= Number(targetValue),
    });

    await newGoal.save();

    return NextResponse.json(newGoal, { status: 201 });
  } catch (error: any) {
    console.error('Create goal error:', error);
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
  }
}
