import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Challenge } from '@/lib/models/challenge';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { progress } = await req.json();

    if (progress === undefined || typeof progress !== 'number') {
      return NextResponse.json({ error: 'Invalid progress value' }, { status: 400 });
    }

    const boundedProgress = Math.min(Math.max(progress, 0), 100);

    await connectToDatabase();

    const challenge = await Challenge.findOne({ _id: id, userId: session.user.id });
    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    challenge.progress = boundedProgress;
    challenge.isCompleted = boundedProgress === 100;
    challenge.completedAt = boundedProgress === 100 ? new Date() : undefined;

    await challenge.save();

    return NextResponse.json(challenge);
  } catch (error: any) {
    console.error('Update challenge error:', error);
    return NextResponse.json({ error: 'Failed to update challenge' }, { status: 500 });
  }
}
