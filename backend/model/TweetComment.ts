import mongoose, { Model, Schema } from "mongoose";

interface IComment extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    tweetId: mongoose.Schema.Types.ObjectId;
    username: string,
    text: string;
    createdAt: Date;
}

const CommentSchema: Schema<IComment> = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    tweetId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Tweet', 
        required: true 
    },
    text: {
        type: String,
        required: true,
        maxlength: 280
    },
    username: {
        type: String,
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

export const TweetComment: Model<IComment> = mongoose.model<IComment>('Comment', CommentSchema);

