import mongoose, { Document, Schema, Model } from 'mongoose';

interface IFollow extends Document {
    follower: mongoose.Schema.Types.ObjectId;
    following: mongoose.Schema.Types.ObjectId;
    createdAt?: Date; // Optional: Managed by Mongoose timestamps
}

const FollowSchema: Schema<IFollow> = new mongoose.Schema({
    follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    following: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

// Index to ensure that one user cannot follow another user more than once
FollowSchema.index({ follower: 1, following: 1 }, { unique: true });

export const Follow: Model<IFollow> = mongoose.model<IFollow>('Follow', FollowSchema);

