import mongoose, { Schema } from 'mongoose';

const ChallengeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  challengeId: { type: String, required: true }, // e.g. 'no-car-day'
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // Waste, Travel, Energy, Water
  difficulty: { type: String, required: true }, // Easy, Medium, Hard
  progress: { type: Number, default: 0 }, // 0 to 100
  isCompleted: { type: Boolean, default: false },
  startDate: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

// Compound index to ensure a user only tracks a specific challenge once in an active state,
// or we can allow historical tracking. Let's index on userId and challengeId.
ChallengeSchema.index({ userId: 1, challengeId: 1 }, { unique: true });

export const Challenge = mongoose.models.Challenge || mongoose.model('Challenge', ChallengeSchema);
