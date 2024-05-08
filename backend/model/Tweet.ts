import mongoose, { Document, Schema, Model } from 'mongoose';

interface ITweet extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    username: string,
    text: string;
    createdAt: Date;
}

const TweetSchema: Schema<ITweet> = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    text: { type: String, required: true, maxlength: 280 },
    createdAt: { type: Date, default: Date.now }
});

export const Tweet: Model<ITweet> = mongoose.model<ITweet>('Tweet', TweetSchema);
