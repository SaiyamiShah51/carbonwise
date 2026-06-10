import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Challenge } from '@/lib/models/challenge';

const PRESET_CHALLENGES = [
  {
    challengeId: 'plastic-free-week',
    title: 'Plastic Free Week',
    description: 'Avoid purchasing or using single-use plastics (bottles, bags, straws, utensils) for 7 full days.',
    category: 'Waste',
    difficulty: 'Medium',
  },
  {
    challengeId: 'no-car-day',
    title: 'No-Car Commute Day',
    description: 'Leave the car in the garage. Commute using only public transit, bicycling, walking, or carpooling.',
    category: 'Travel',
    difficulty: 'Easy',
  },
  {
    challengeId: 'energy-saving',
    title: 'Vampire Power Challenge',
    description: 'Unplug all chargers, televisions, and non-essential appliances for 24 hours to eliminate idle power draw.',
    category: 'Energy',
    difficulty: 'Easy',
  },
  {
    challengeId: 'water-conservation',
    title: 'Shower-Time Limit Challenge',
    description: 'Limit domestic showers to under 5 minutes, turn off faucets while brushing teeth, and conserve utility water.',
    category: 'Water',
    difficulty: 'Medium',
  },
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Fetch existing challenges for the user
    let userChallenges = await Challenge.find({ userId: session.user.id });

    // If some presets are missing, seed them
    if (userChallenges.length < PRESET_CHALLENGES.length) {
      const seededChallenges = [];

      for (const preset of PRESET_CHALLENGES) {
        const exists = userChallenges.some((c) => c.challengeId === preset.challengeId);
        if (!exists) {
          const newChallenge = new Challenge({
            userId: session.user.id,
            challengeId: preset.challengeId,
            title: preset.title,
            description: preset.description,
            category: preset.category,
            difficulty: preset.difficulty,
            progress: 0,
            isCompleted: false,
          });
          await newChallenge.save();
          seededChallenges.push(newChallenge);
        }
      }

      // Re-fetch all challenges to return complete list
      userChallenges = await Challenge.find({ userId: session.user.id });
    }

    return NextResponse.json(userChallenges);
  } catch (error: any) {
    console.error('Fetch challenges error:', error);
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 });
  }
}
