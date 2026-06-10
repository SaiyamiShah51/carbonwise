import mongoose, { Schema } from 'mongoose';

const RecommendationSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // Travel, Energy, Waste, Food, Water
  impactLevel: { type: String, required: true }, // High, Medium, Low
});

const WeeklyGoalSchema = new Schema({
  title: { type: String, required: true },
  targetValue: { type: Number, required: true },
  unit: { type: String, required: true },
});

const InsightSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  analysis: { type: String, required: true },
  majorSources: [{ type: String }],
  recommendations: [RecommendationSchema],
  weeklyGoals: [WeeklyGoalSchema],
  createdAt: { type: Date, default: Date.now },
});

export const Insight = mongoose.models.Insight || mongoose.model('Insight', InsightSchema);
