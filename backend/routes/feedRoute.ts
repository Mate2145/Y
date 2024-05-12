import { Router, Request, Response, NextFunction } from 'express';
import { MainClass } from '../main-class';
import { PassportStatic } from 'passport';
import { User } from '../model/User';
import mongoose, { ObjectId } from 'mongoose';
import { Tweet } from '../model/Tweet';
import { Like } from '../model/Like';
import { TweetComment } from '../model/TweetComment';
import { Follow } from '../model/Follow';
import { UserService } from '../service/UserService';
import * as repl from "repl";


export const feedRoutes = (passport: PassportStatic, router: Router): Router => {

        // GET all tweets
    router.get('/tweets', async (req, res) => {
        try {
            const tweets = await Tweet.find();
            res.status(200).send(tweets);
        } catch (error) {
            res.status(500).send(error);
        }
    });

    router.get('/tweetswithcount', async (req, res) => {
        try {
            const tweets = await Tweet.find()
            .sort({ createdAt: -1 });
    
            // Map each tweet to a promise that resolves to the tweet plus its like and comment counts
            const tweetsWithCounts = await Promise.all(tweets.map(async tweet => {
                const likeCount = await Like.countDocuments({ tweetId: tweet._id });
                const commentCount = await Tweet.countDocuments({ parentId: tweet._id });
                return {
                    ...tweet.toObject(), // Convert Mongoose document to a plain JavaScript object
                    likeCount,
                    commentCount
                };
            }));
    
            res.status(200).send(tweetsWithCounts);
        } catch (error) {
            res.status(500).send(error);
        }
    });

    router.get('/commentswithcount/:parentId', async (req, res) => {
        try {
            // Ensure parentId is provided in the request body
            const parentId = req.params.parentId as string;
            if (!parentId) {
                return res.status(400).send('Parent ID is required');
            }

            // Query to find all comments related to the given parentId
            const tweets = await Tweet.find({ parentId: parentId }).sort({ createdAt: -1 });

            // Map each comment to a promise that resolves to the comment plus its like and comment counts
            const commentsWithCounts = await Promise.all(tweets.map(async tweet => {
                const likeCount = await Like.countDocuments({ tweetId: tweet._id});
                const commentCount = await Tweet.countDocuments({ parentId: tweet._id});
                return {
                    ...tweet.toObject(), // Convert Mongoose document to a plain JavaScript object
                    likeCount,
                    commentCount
                };
            }));

            res.status(200).send(commentsWithCounts);
        } catch (error) {
            res.status(500).send(error);
        }
    });
    

    // GET a single tweet by ID
    router.get('/tweets/:id', async (req, res) => {

        // Check if the user is authenticated
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not authenticated.');
        }

        try {
            const tweet = await Tweet.findById(req.params.id);
            if (!tweet) {
                return res.status(404).send('Tweet not found');
            }

        // Count likes and comments for the tweet
        const likeCount = await Like.countDocuments({ tweetId: tweet._id });
        const commentCount = await TweetComment.countDocuments({ tweetId: tweet._id });

        // Return the tweet along with the counts of likes and comments
        res.status(200).send({
            tweet,
            likeCount,
            commentCount
        });
        } catch (error) {
            res.status(500).send(error);
        }
    });

    router.get('/tweet-user/:userId', async (req, res) => {
        // Check if the user is authenticated
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not authenticated.');
        }

        try {
            let userId = req.params.userId as string
            if (userId != ''){
                userId = req.user as string
            }

            // Find tweets by userId
            const tweets = await Tweet.find({ userId: req.params.userId,parentId: null });

            if (!tweets) {
                return res.status(404).send('Tweets not found for the user.');
            }

            // Array to store tweets with like and comment counts
            const tweetsWithCounts = [];

            // Loop through each tweet to count likes and comments
            for (const tweet of tweets) {
                // Count likes and comments for the tweet
                const likeCount = await Like.countDocuments({ tweetId: tweet._id });
                const commentCount = await TweetComment.countDocuments({ tweetId: tweet._id });

                // Add tweet with counts to the array
                tweetsWithCounts.push({
                    tweet,
                    likeCount,
                    commentCount
                });
            }

            // Return the tweets along with the counts of likes and comments
            res.status(200).send(tweetsWithCounts);
        } catch (error) {
            res.status(500).send(error);
        }
    });


    router.get('/tweet-user-replies/:userId', async (req, res) => {
        try {
            // Check if the user is authenticated
            if (!req.isAuthenticated()) {
                return res.status(401).send('User is not authenticated.');
            }

            let userId = req.params.userId as string;
            if (userId !== '') {
                userId = req.user as string; // Assuming req.user is a valid user object
            }

            // Find parent tweets by userId
            const parentTweets = await Tweet.find({ userId:userId, parentId: null }).sort({ createdAt: -1 });

            // Array to store parent tweets and their corresponding replies
            const tweetsWithReplies = [];

            // Loop through each parent tweet to find its replies
            for (const parentTweet of parentTweets) {
                // Find replies (comments) for the parent tweet
                const replies = await Tweet.find({ userId:userId, parentId: parentTweet._id }).sort({ createdAt: 1 });
                if (!replies){
                    tweetsWithReplies.push({
                        parentTweet: parentTweet,
                        replies: replies
                    });
                }
                else {
                    // Add parent tweet and its replies to the array
                    tweetsWithReplies.push({
                        parentTweet: parentTweet,
                        replies: replies
                    });
                }
            }

            // Return the array containing parent tweets and their replies
            res.status(200).send(tweetsWithReplies);
        } catch (error) {
            res.status(500).send(error);
        }
    });


    // UPDATE a tweet
    router.patch('/tweets/:id', async (req, res) => {

        // Check if the user is authenticated
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not authenticated.');
        }

        try {
            console.log("About to update Tweet")
            const text = req.body.text;
            const currentUserId = req.user as mongoose.Schema.Types.ObjectId

            const tweet = await Tweet.findById(req.params.id);
            if (!tweet) {
                return res.status(404).send('Tweet not found');
            }
            console.log("userID: " + currentUserId + "TweeterID: " + tweet.userId)
            // Check if the tweet belongs to the current user
            if (tweet.userId != currentUserId) {
                return res.status(403).send('Unauthorized: You can only update your own tweets');
            }

            const tweetresult = await Tweet.findByIdAndUpdate(req.params.id, { text }, { new: true });
            if (!tweetresult) {
                return res.status(404).send('Tweet not found');
            }
            console.log(tweetresult)
            res.status(200).send(tweetresult);
        } catch (error) {
            res.status(500).send(error);
        }
    });

        // DELETE a tweet
    router.delete('/tweets/:id', async (req, res) => {
        // Check if the user is authenticated
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not authenticated.');
        }

        try {

            const currentUserId = req.user as mongoose.Schema.Types.ObjectId

            const tweet = await Tweet.findById(req.params.id);
            if (!tweet) {
                return res.status(404).send('Tweet not found');
            }

            // Check if the tweet belongs to the current user
            if (tweet.userId != currentUserId) {
                return res.status(403).send('Unauthorized: You can only delete your own tweets');
            }
            console.log("About to DELETE tweet: " + req.params.id)
            const result = await Tweet.findByIdAndDelete(req.params.id);
            if (!result) {
                return res.status(404).send('Delete canceled');
            }
            res.status(200).send({ message: 'Tweet deleted successfully' });
        } catch (error) {
            res.status(500).send(error);
        }
    });




    //CREATE
    router.post('/tweet', async (req: Request, res: Response) => {
        // Check if the user is authenticated
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not authenticated.');
        }
        
        try {

            const userid = req.user as string;
            const user = await User.findById(userid);
            console.log(user)
                
            if (!user) {
                return res.status(404).send('User not found.');
            }

            console.log(req.body)
            console.log(userid)
            const username = user?.nickname
            const {text,parentId} = req.body
            if (!mongoose.Types.ObjectId.isValid(userid)) {
                return res.status(400).send('Invalid user ID.');
            }
            console.log("Creating Tweet with userId " + userid + " " + "text " + text)
            const tweetData = {
                userId: userid,
                username: username,
                text: text,
                parentId:null
            };

            // If parentId is provided and valid, include it in the tweet data
            if (parentId) {
                if (!mongoose.Types.ObjectId.isValid(parentId)) {
                    return res.status(400).send('Invalid parent ID.');
                }
                tweetData.parentId = parentId; // Add parentId to the tweet data
            }
            const tweet = new Tweet(tweetData)
            console.log(tweet)
            await tweet.save();
            return res.status(201).send(tweet);
        } catch (error) {
            return res.status(500).send(error);
        }
    });

    router.post('/like', async (req, res) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('Authentication required');
        }

        try {
            const userId = req.user as string;
            const user = await User.findById(userId);
                
            if (!user) {
                return res.status(404).send('User not found.');
            }
            const username = user.nickname
            const { tweetId } = req.body;
            console.log(tweetId);
            if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(tweetId)) {
                return res.status(400).send('Invalid userId or tweetId.');
            }
    
            // Ensure the tweet exists
            const tweetExists = await Tweet.findById(tweetId);
            const commentExists = await TweetComment.findById(tweetId);
            // Ensure either the tweet or the comment exists, but not both
            if ((!tweetExists && !commentExists) || (tweetExists && commentExists)) {
                return res.status(404).send('Tweet not found.');
            }


    
            // Prevent duplicate likes
            const existingLike = await Like.findOne({ userId, tweetId });
            if (existingLike) {
                return res.status(409).send('Like already exists.');
            }
    
            const like = new Like({
                userId: userId,
                tweetId: tweetId,
                username: username
            });
            console.log("About to save Like " + tweetId)
            await like.save();

            // Get the count of likes for the tweet
            const likeCount = await Like.countDocuments({ tweetId });

            res.status(201).send({
                like: like,
                status: likeCount
            });
        } catch (error) {
            res.status(500).send(error);
        }
    });


    router.delete('/unlike/:tweetId', async (req, res) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('Authentication required');
        }


        try {
            const userId = req.user as string;
            const user = await User.findById(userId);
                
            if (!user) {
                return res.status(404).send('User not found.');
            }

            const tweetId = req.params.tweetId;
            console.log(tweetId);
            // Ensure the tweet exists
            const tweetExists = await Tweet.findById(tweetId);
            const commentExists = await TweetComment.findById(tweetId);
            // Ensure either the tweet or the comment exists, but not both
            if ((!tweetExists && !commentExists) || (tweetExists && commentExists)) {
                return res.status(404).send('Tweet not found.');
            }
            console.log('About to delete like ' + tweetId)
            const like = await Like.findOneAndDelete({ userId, tweetId });
            if (!like) {
                return res.status(404).send('Like not found or already removed.');
            }

            console.log("Unliked succes " + tweetId)
            // Get the count of likes for the tweet
            const likeCount = await Like.countDocuments({ tweetId });

            res.status(201).send({
                like: like,
                status: likeCount
            });
        } catch (error) {
            res.status(500).send(error);
        }
    });


    router.get('/check-like/:tweetId', async (req: Request, res: Response) => {
        // Check if user is authenticated
        if (!req.isAuthenticated()) {
            return res.status(401).send('Authentication required');
        }
    
        try {
            const userId = req.user as string;
            const tweetId = req.params.tweetId;
    
            // Check if the user has already liked the tweet
            const existingLike = await Like.findOne({ userId, tweetId });
    
            // If a like entry exists, the user has already liked the tweet
            const isLiked = !!existingLike;

            console.log(isLiked)
    
            // Return the result as a boolean value
            res.status(200).json({
                isLiked: isLiked
            });
        } catch (error) {
            console.error('Error checking like:', error);
            res.status(500).send('Internal Server Error');
        }
    });

    router.get('/check-tweet/:userId', async (req: Request, res: Response) => {
        // Check if user is authenticated
        if (!req.isAuthenticated()) {
            return res.status(401).send('Authentication required');
        }

        try {
            const authuserId = req.user as string;
            const userId = req.params.userId;
            let checkTweet = false
            if (authuserId == userId){
                checkTweet = !checkTweet
            }


            console.log(checkTweet)

            // Return the result as a boolean value
            res.status(200).json({
                checkTweet: checkTweet
            });
        } catch (error) {
            console.error('Error checking like:', error);
            res.status(500).send('Internal Server Error');
        }
    });


    router.delete('/comments/:id', async (req, res) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not authenticated.');
        }
    
        try {
            const commentId = req.params.id;
            const currentUserId = req.body.currentUserId

            // Validate user and tweet IDs
            if (!mongoose.Types.ObjectId.isValid(commentId) || !mongoose.Types.ObjectId.isValid(currentUserId)) {
                return res.status(400).send('Invalid userId or tweetId.');
            }
    
            const comment = await TweetComment.findById(commentId);
            if (!comment) {
                return res.status(404).send('Comment not found.');
            }
    
            if (!comment.userId != currentUserId) {
                return res.status(403).send('Unauthorized: You can only delete your own comments.');
            }
    
            await TweetComment.findByIdAndDelete(commentId);
            res.status(200).send({ message: 'Comment successfully deleted.' });
        } catch (error) {
            res.status(500).send(error);
        }
    });
    
    

    return router;
}