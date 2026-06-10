import mongoose, { Schema } from 'mongoose';

const CarbonRecordSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  
  // Travel inputs
  vehicleType: { type: String, required: true },
  dailyTravelDistance: { type: Number, required: true },
  fuelUsage: { type: Number, required: true }, // Liters per month
  publicTransportUsage: { type: Number, required: true }, // km per day
  
  // Home utility inputs
  electricityConsumption: { type: Number, required: true }, // kWh per month
  waterUsage: { type: Number, required: true }, // Liters per day
  
  // Lifestyle inputs
  foodHabits: { type: String, required: true }, // Meat Heavy, Average, Vegetarian, Vegan
  shoppingFrequency: { type: String, required: true }, // High, Medium, Low
  wasteGeneration: { type: Number, required: true }, // kg per week
  
  // Calculated outputs (stored in kg CO2)
  dailyEmissions: { type: Number, required: true },
  monthlyEmissions: { type: Number, required: true },
  annualEmissions: { type: Number, required: true },
  
  createdAt: { type: Date, default: Date.now },
});

export const CarbonRecord = mongoose.models.CarbonRecord || mongoose.model('CarbonRecord', CarbonRecordSchema);
