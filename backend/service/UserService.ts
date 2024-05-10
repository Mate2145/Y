import { Request, Response } from 'express';
import { User } from '../model/User';

export class UserService {
    static async findByIdAndAuthenticate(userId: string, req: Request, res: Response): Promise<any | null> {
        if (!req.isAuthenticated()) {
            res.status(401).send('Authentication required');
            return null;
        }
        
        try {
            // Find the user with the given userID
            const user = await User.findById(userId);
            
            if (!user) {
                res.status(404).send('User not found.');
                return null;
            }

            return user;
        } catch (error) {
            console.error('Error retrieving user:', error);
            res.status(500).send('Internal Server Error');
            return null;
        }
    }
}
