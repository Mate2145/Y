import { Router, Request, Response, NextFunction } from 'express';
import { MainClass } from '../main-class';
import { PassportStatic } from 'passport';
import { User } from '../model/User';


export const configureRoutes = (passport: PassportStatic, router: Router): Router => {

    router.get('/', (req: Request, res: Response) => {
        let myClass = new MainClass();
        res.status(200).send('Hello, World!');
    });


    router.post('/login', (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', (error: string | null, user: typeof User) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                if (!user) {
                    res.status(400).send('User not found.');
                } else {
                    req.login(user, (err: string | null) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Internal server error.');
                        } else {
                            res.status(200).send(user);
                        }
                    });
                }
            }
        })(req, res, next);
    });

    router.post('/register', (req: Request, res: Response) => {
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;
        const address = req.body.address;
        const nickname = req.body.nickname;
        const user = new User({email: email, password: password, name: name, address: address, nickname: nickname});
        user.save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        })
    });

    router.post('/logout', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Internal server error.');
                }
                res.status(200).send('Successfully logged out.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.get('/getAllUsers', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const query = User.find();
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.get('/checkAuth', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            res.status(200).send(true);            
        } else {
            res.status(500).send(false);
        }
    });

    router.delete('/deleteUser', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const id = req.query.id;
            const query = User.deleteOne({_id: id});
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    return router;
}