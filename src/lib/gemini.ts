import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Scientific mock fallback recommendations if API key is not provided
function getMockInsights(latestRecord: any) {
  const sources: string[] = [];
  const recommendations: any[] = [];
  const weeklyGoals: any[] = [];

  // Determine highest emission components
  const travelEmissions = (latestRecord.dailyTravelDistance * (latestRecord.vehicleType === 'electric' ? 0.05 : 0.18)) + ((latestRecord.fuelUsage * 2.31) / 30);
  const energyEmissions = (latestRecord.electricityConsumption * 0.45) / 30;
  const dietEmissions = latestRecord.foodHabits === 'meat-heavy' ? 7.2 : latestRecord.foodHabits === 'vegetarian' ? 3.8 : 2.9;
  const wasteEmissions = (latestRecord.wasteGeneration * 0.5) / 7;

  if (travelEmissions > 2) {
    sources.push('Private vehicle transportation');
    recommendations.push({
      title: 'Transition to Hybrid or Electric Travel',
      description: 'Your private car travel constitutes a significant portion of your score. Consider carpooling, biking for shorter distances, or switching to hybrid/electric vehicles.',
      category: 'Travel',
      impactLevel: 'High'
    });
    weeklyGoals.push({
      title: 'Reduce private car travel distance',
      targetValue: 20,
      unit: '%'
    });
  }

  if (energyEmissions > 3) {
    sources.push('Home heating and electricity consumption');
    recommendations.push({
      title: 'Upgrade to Energy-Efficient LED Lighting',
      description: 'Home utilities represent a high impact area. Replacing your incandescent bulbs with LEDs saves up to 75% energy and lowers emissions significantly.',
      category: 'Energy',
      impactLevel: 'High'
    });
    weeklyGoals.push({
      title: 'Lower home electricity consumption',
      targetValue: 15,
      unit: 'kWh'
    });
  }

  if (latestRecord.foodHabits === 'meat-heavy' || latestRecord.foodHabits === 'average') {
    sources.push('Dietary habits involving animal products');
    recommendations.push({
      title: 'Introduce Plant-Based Meals',
      description: 'Animal farming generates high greenhouse gas emissions. Try swaping beef or pork for lentils, beans, or plant-based proteins multiple days a week.',
      category: 'Food',
      impactLevel: 'Medium'
    });
    weeklyGoals.push({
      title: 'Engage in meat-free meals this week',
      targetValue: 4,
      unit: 'meals'
    });
  }

  if (latestRecord.waterUsage > 250) {
    sources.push('High domestic water usage');
    recommendations.push({
      title: 'Install Aerators on Faucets',
      description: 'Reducing hot water usage has the double benefit of preserving water reserves and lowering utility heating fuel usage.',
      category: 'Water',
      impactLevel: 'Low'
    });
    weeklyGoals.push({
      title: 'Reduce average daily shower time',
      targetValue: 2,
      unit: 'minutes'
    });
  }

  if (latestRecord.wasteGeneration > 10) {
    sources.push('Household general landfill waste');
    recommendations.push({
      title: 'Begin Organic Waste Composting',
      description: 'Food waste in garbage dumps rots anaerobically, generating heat-trapping methane. Setting up a compost bin diverts waste into rich organic soil.',
      category: 'Waste',
      impactLevel: 'Medium'
    });
    weeklyGoals.push({
      title: 'Reduce household waste bag generation',
      targetValue: 1,
      unit: 'bags'
    });
  }

  // Ensure we always have some recommendations
  if (recommendations.length === 0) {
    sources.push('Miscellaneous household habits');
    recommendations.push({
      title: 'Support Clean Energy Grid Upgrades',
      description: 'Even small footprints have room for improvement. Investigate local community solar programs to clean up your grid source.',
      category: 'Energy',
      impactLevel: 'Low'
    });
    weeklyGoals.push({
      title: 'Read local clean energy options',
      targetValue: 1,
      unit: 'plan'
    });
  }

  const roundedFootprint = Math.round(latestRecord.dailyEmissions * 365 / 1000 * 10) / 10;

  return {
    analysis: `Based on your recent calculations, your estimated annual carbon footprint is ${roundedFootprint} tonnes of CO2 equivalent. Your travel and lifestyle inputs suggest that adjustments in your ${sources.slice(0, 2).join(' and ')} would yield the most immediate benefits. Following our custom reduction goals can lower your total emissions by up to 25% over the next few months.`,
    majorSources: sources,
    recommendations,
    weeklyGoals
  };
}

export async function generateSustainabilityInsights(latestRecord: any) {
  // Check if API key is present
  if (!genAI) {
    console.log('Gemini API key is not set. Using local rule-based sustainability recommendations.');
    return getMockInsights(latestRecord);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
      You are an expert environmental consultant and sustainability AI.
      Analyze the following user carbon footprint record and generate custom sustainability insights.
      
      User Inputs:
      - Vehicle type: ${latestRecord.vehicleType}
      - Daily travel distance: ${latestRecord.dailyTravelDistance} km
      - Monthly fuel usage: ${latestRecord.fuelUsage} liters
      - Daily public transport usage: ${latestRecord.publicTransportUsage} km
      - Monthly electricity consumption: ${latestRecord.electricityConsumption} kWh
      - Daily water usage: ${latestRecord.waterUsage} liters
      - Food habits: ${latestRecord.foodHabits}
      - Shopping frequency: ${latestRecord.shoppingFrequency}
      - Weekly waste generation: ${latestRecord.wasteGeneration} kg
      
      Calculated Emissions:
      - Daily emissions: ${latestRecord.dailyEmissions} kg CO2
      - Annual emissions: ${latestRecord.dailyEmissions * 365} kg CO2
      
      Provide a response in strict JSON format matching this schema:
      {
        "analysis": "A detailed 3-4 sentence paragraph analyzing the user's footprint, identifying where they stand relative to the 2-tonne global target, and summarizing their main opportunities.",
        "majorSources": ["String detailing major source 1", "String detailing major source 2"],
        "recommendations": [
          {
            "title": "Clear action-oriented title",
            "description": "Elaborate in 1-2 sentences on how to execute this action and why it helps.",
            "category": "Travel" | "Energy" | "Food" | "Water" | "Waste",
            "impactLevel": "High" | "Medium" | "Low"
          }
        ],
        "weeklyGoals": [
          {
            "title": "Clear, measurable weekly task description",
            "targetValue": number,
            "unit": "string (e.g. %, meals, minutes, kWh)"
          }
        ]
      }
      
      Make sure to return ONLY the raw JSON string. Do not include markdown code block syntax (\`\`\`json).
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    
    // Clean up any markdown blocks if returned
    const cleanJson = responseText.replace(/^```json\s*/i, '').replace(/```$/, '');
    
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Failed to generate insights via Gemini API, falling back to rule-based engine:', error);
    return getMockInsights(latestRecord);
  }
}
