import mongoose, { Schema } from 'mongoose';

const GoalSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true }, // Travel, Energy, Waste, Food, Water, General
  targetValue: { type: Number, required: true },
  currentValue: { type: Number, default: 0 },
  unit: { type: String, required: true }, // e.g., kg CO2, km, %
  deadline: { type: Date, required: true },
  isCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Goal = mongoose.models.Goal || mongoose.model('Goal', GoalSchema);
