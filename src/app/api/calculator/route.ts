import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { CarbonRecord } from '@/lib/models/carbon-record';

// Constants for carbon emission factors (kg CO2 equivalent)
const EMISSION_FACTORS = {
  // Vehicle types (kg per km)
  vehicle: {
    petrol: 0.18,
    diesel: 0.17,
    hybrid: 0.10,
    electric: 0.05,
    motorcycle: 0.10,
    none: 0,
  },
  // Fuel usage (kg per liter)
  fuel: {
    petrol: 2.31,
    diesel: 2.68,
  },
  // Public transport (kg per km)
  publicTransport: 0.03,
  // Electricity (kg per kWh)
  electricity: 0.45,
  // Water (kg per liter)
  water: 0.0003,
  // Diet types (kg per day)
  food: {
    'meat-heavy': 7.2,
    average: 5.6,
    vegetarian: 3.8,
    vegan: 2.9,
  },
  // Shopping frequency (kg per day equivalent)
  shopping: {
    high: 5.0,
    medium: 2.5,
    low: 0.5,
  },
  // Waste (kg CO2 per kg waste)
  waste: 0.5,
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const records = await CarbonRecord.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json(records);
  } catch (error: any) {
    console.error('Fetch carbon records error:', error);
    return NextResponse.json({ error: 'Failed to fetch carbon records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      vehicleType,
      dailyTravelDistance,
      fuelUsage,
      publicTransportUsage,
      electricityConsumption,
      waterUsage,
      foodHabits,
      shoppingFrequency,
      wasteGeneration,
    } = body;

    // Connect to DB
    await connectToDatabase();

    // 1. Travel Emissions (Daily)
    const travelDistanceDaily = Number(dailyTravelDistance) || 0;
    const vehicleFactor = EMISSION_FACTORS.vehicle[vehicleType as keyof typeof EMISSION_FACTORS.vehicle] || 0;
    const distanceEmissions = travelDistanceDaily * vehicleFactor;
    
    // Fuel emissions (L/month converted to daily)
    const monthlyFuel = Number(fuelUsage) || 0;
    const fuelFactor = vehicleType === 'diesel' ? EMISSION_FACTORS.fuel.diesel : EMISSION_FACTORS.fuel.petrol;
    const fuelEmissions = (monthlyFuel * fuelFactor) / 30;
    
    const transportEmissions = distanceEmissions + fuelEmissions;

    // 2. Public Transport Emissions (Daily)
    const publicTransitDistance = Number(publicTransportUsage) || 0;
    const publicTransitEmissions = publicTransitDistance * EMISSION_FACTORS.publicTransport;

    // 3. Electricity Emissions (Daily)
    const monthlyKwh = Number(electricityConsumption) || 0;
    const electricityEmissions = (monthlyKwh * EMISSION_FACTORS.electricity) / 30;

    // 4. Water Emissions (Daily)
    const waterDailyLiters = Number(waterUsage) || 0;
    const waterEmissions = waterDailyLiters * EMISSION_FACTORS.water;

    // 5. Diet Emissions (Daily)
    const dietEmissions = EMISSION_FACTORS.food[foodHabits as keyof typeof EMISSION_FACTORS.food] || EMISSION_FACTORS.food.average;

    // 6. Shopping Emissions (Daily)
    const shopEmissions = EMISSION_FACTORS.shopping[shoppingFrequency as keyof typeof EMISSION_FACTORS.shopping] || EMISSION_FACTORS.shopping.medium;

    // 7. Waste Emissions (Daily)
    const wasteWeeklyKg = Number(wasteGeneration) || 0;
    const wasteEmissions = (wasteWeeklyKg * EMISSION_FACTORS.waste) / 7;

    // Total calculations (Daily)
    const dailyEmissions = 
      transportEmissions + 
      publicTransitEmissions + 
      electricityEmissions + 
      waterEmissions + 
      dietEmissions + 
      shopEmissions + 
      wasteEmissions;

    const monthlyEmissions = dailyEmissions * 30;
    const annualEmissions = dailyEmissions * 365;

    // Save record
    const newRecord = new CarbonRecord({
      userId: session.user.id,
      vehicleType,
      dailyTravelDistance: Number(dailyTravelDistance),
      fuelUsage: Number(fuelUsage),
      publicTransportUsage: Number(publicTransportUsage),
      electricityConsumption: Number(electricityConsumption),
      waterUsage: Number(waterUsage),
      foodHabits,
      shoppingFrequency,
      wasteGeneration: Number(wasteGeneration),
      dailyEmissions: Math.round(dailyEmissions * 100) / 100,
      monthlyEmissions: Math.round(monthlyEmissions * 100) / 100,
      annualEmissions: Math.round(annualEmissions * 100) / 100,
    });

    await newRecord.save();

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error: any) {
    console.error('Calculate carbon emissions error:', error);
    return NextResponse.json({ error: 'Failed to process carbon footprint calculation' }, { status: 500 });
  }
}
