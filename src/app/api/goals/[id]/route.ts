import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Goal } from '@/lib/models/goal';

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
    const body = await req.json();
    const { currentValue, title, description, category, targetValue, deadline } = body;

    await connectToDatabase();

    // Find first to verify ownership
    const goal = await Goal.findOne({ _id: id, userId: session.user.id });
    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    // Update fields
    if (title !== undefined) goal.title = title;
    if (description !== undefined) goal.description = description;
    if (category !== undefined) goal.category = category;
    if (targetValue !== undefined) goal.targetValue = Number(targetValue);
    if (deadline !== undefined) goal.deadline = new Date(deadline);
    
    if (currentValue !== undefined) {
      goal.currentValue = Number(currentValue);
      // Mark as completed if target is reached
      goal.isCompleted = goal.currentValue >= goal.targetValue;
    }

    await goal.save();

    return NextResponse.json(goal);
  } catch (error: any) {
    console.error('Update goal error:', error);
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await connectToDatabase();

    const result = await Goal.deleteOne({ _id: id, userId: session.user.id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Goal deleted successfully' });
  } catch (error: any) {
    console.error('Delete goal error:', error);
    return NextResponse.json({ error: 'Failed to delete goal' }, { status: 500 });
  }
}
