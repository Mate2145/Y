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


export const userRoutes = (passport: PassportStatic, router: Router): Router => {

    // Get user information by ID
    router.get('/get-user/:id', async (req, res) => {
        try {
            // Find user by ID
            const user = await User.findById(req.params.id);

            if (!user){
                res.status(500).send("No user found!");
            }

            // Count the number of followers and follows for the user
            const followerCount = await Follow.countDocuments({ following: req.params.id });
            const followeeCount = await Follow.countDocuments({ follower: req.params.id });

            // Add followerCount and followeeCount to the user object
            const userWithCounts = {
                _id: user!._id,
                username: user!.nickname,
                // Add other user properties as needed
                followerCount,
                followeeCount
            };

            // Return user information with follower and followee counts
            res.status(200).send(userWithCounts);
        } catch (error) {
            res.status(500).send(error);
        }
    });

    // Get user information by ID
    router.get('/get-users', async (req, res) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('Authentication required');
        }

        try {

            const isAdmin = UserService.isAdmin(req.user as string,req)
            if (!isAdmin){
                return res.status(401).send('Admin role required');
            }
            // Find user by ID
            const user = await User.find();

            if (!user){
                res.status(500).send("No user found!");
            }
            // Return user information with follower and followee counts
            res.status(200).send(user);
        } catch (error) {
            res.status(500).send(error);
        }
    });

    router.get('/get-auth-id', async (req, res) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('Authentication required');
        }
        try {
            const user = await User.findById(req.user as string);
            if (!user){
                res.status(500).send("No user found!");
            }
            res.status(200).send(user);
        } catch (error) {
            res.status(500).send(error);
        }
    });

    router.delete('/delete-user/:id', async (req, res) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('Authentication required');
        }

        try {

            const isAdmin = UserService.isAdmin(req.user as string,req)
            if (!isAdmin){
                return res.status(401).send('Admin role required');
            }
            // Find user by ID
            const user = await User.findByIdAndDelete(req.params.id);

            if (!user){
                res.status(500).send("No user found!");
            }
            // Return user information with follower and followee counts
            res.status(200).send(user);
        } catch (error) {
            res.status(500).send(error);
        }
    });

    router.get('/isAdmin', async (req, res) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('Authentication required');
        }

        try {
            // Find user by ID
            const user = await User.findById(req.user as string);

            if (!user){
                res.status(500).send("No user found!");
            }

            let isAdmin = false
            if (user && user.admin){
                isAdmin = true
            }
            // Return user information with follower and followee counts
            res.status(200).send(isAdmin);
        } catch (error) {
            res.status(500).send(error);
        }
    });


    router.post('/follow', async (req, res) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('Authentication required');
        }
        const followerId = req.user as string
        const {followingId} = req.body;

        if (!mongoose.Types.ObjectId.isValid(followingId) && !mongoose.Types.ObjectId.isValid(followerId)) {
            return res.status(400).send('Invalid user ID.');
        }

        try {
            const existingFollow = await Follow.findOne({ follower: followerId, following: followingId });
            if (existingFollow) {
                return res.status(409).send('Already following this user.');
            }

            const follow = new Follow({
                follower: followerId,
                following: followingId
            });

            await follow.save();
            res.status(201).send({ message: 'Followed successfully' });
        } catch (error) {
            res.status(500).send(error);
        }
    });


    router.get('/isfollow/:id', async (req, res) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('Authentication required');
        }

        const followerId = req.user as string; // Assuming req.user is a valid user object
        const followingId  = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(followingId)) {
            return res.status(400).send('Invalid user ID.');
        }

        if (followingId == followerId){
            return res.status(201).send({
                isFollowed: false,
                isSameId: true
            })
        }

        try {
            let isFollowed = false
            const isFollowing = await Follow.exists({ follower: followerId, following: followingId });
            if (isFollowing){
                isFollowed = true
            }

            res.status(200).send({
                isFollowed: isFollowed,
                isSameId: false
            });
        } catch (error) {
            res.status(500).send(error);
        }
    });

    router.delete('/unfollow/:id', async (req, res) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('Authentication required');
        }

        const followerId = req.user as string
        const followingId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(followingId) || !mongoose.Types.ObjectId.isValid(followerId)) {
            return res.status(400).send('Invalid user ID.');
        }

        try {
            const result = await Follow.findOneAndDelete({ follower: followerId, following: followingId });
            if (!result) {
                return res.status(404).send('Follow relationship not found.');
            }

            res.status(200).send({ message: 'Unfollowed successfully' });
        } catch (error) {
            res.status(500).send(error);
        }
    });

    return router
}