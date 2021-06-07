import User from '../models/user';
import * as jsonwebtoken from 'jsonwebtoken'
import config from '../config/base';
import validateToken from '../middlewares/validate-token';
import * as EmailValidator from 'email-validator';

export async function singUp (req: any, res: any) {
    try {
        const email = <string>req.body.email;
        const password = <string> req.body.password;
        const accepted_privacy_policy = <boolean> req.body.accepted_privacy_policy;
        const accepted_terms_and_conditions = <boolean> req.body.accepted_terms_and_conditions;

        if (!email || !password) { 
            return res.status(400).send(
                {
                    erro_code: 'FIELDS_MISSING',
                    msg:"Required fields missing!",
                }
            );
        }

        if (!EmailValidator.validate(email)) {
            return res.status(400).send(
                {
                    erro_code: 'INVALID_FORMAT_EMAIL',
                    msg:"Invalid email format!",
                }
            );
        }
    
        const user = await User.create({
            email,
            password,
            name: null,
            baby_birth_date: null,
            onboarding_done: false,
            accepted_privacy_policy,
            accepted_terms_and_conditions
        });
        const token = jsonwebtoken.sign(
            { id: user.id, user },
            config.jwtSecret!,
            { expiresIn: '1d' }
          )
    
        res.status(201);
        return res.send({token});
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(422);
            return res.send(
                {
                    erro_code: 'EMAIL_REGISTERED',
                    msg: "Email already registered."
                }
            );    
        } else {
            console.log('error', error);
            res.status(500);
            return res.send(
                {
                    erro_code: 'SERVER_ERROR',
                    msg: "An error occour, please try again!"
                }
            );    
        }
    }
}

export async function logIn (req: any, res: any) {
    try {
        const email = <string>req.body.email;
        const password = <string> req.body.password;
        if (!email || !password) {
            return res.status(400).send(
                {
                    erro_code: 'FIELDS_MISSING',
                    msg:"Required fields missing!",
                }
            );
        }

        const user = await User.findOne({where: {email}});
        if (user && user.validPassword(password)) {
            const token = jsonwebtoken.sign(
                { id: user.id, user },
                config.jwtSecret!,
                { expiresIn: '10m' }
              )
        
            return res.send({token});
        }

        return res.status(422).send(
            {
                erro_code: 'INVALID_EMAIL_PASSWORD',
                msg: "Email or password invalid."
            }
        );
    } catch (error) {
        console.log('error', error);
        res.status(500);
        return res.send(
            {
                erro_code: 'SERVER_ERROR',
                msg: "An error occour, please try again!"
            }
        );
    }
}

export async function update (req: any, res: any) {
    try {
        const token = req.get("Authorization");
        const decodedToken = validateToken(token);
        if (decodedToken) { // Adding this just to avoid lint errors
            const user = await User.findOne({where: {email: decodedToken.user.email}});
            if (user) { // Adding this just to avoid lint errors
                
                const name = <string> req.body.name;
                const baby_birth_date = req.body.baby_birth_date !== '' ? <Date> req.body.baby_birth_date : null;

                if (!name && !baby_birth_date) { 
                    return res.status(400).send(
                        {
                            erro_code: 'FIELDS_MISSING',
                            msg:"Required fields missing!",
                        }        
                    );
                }

                if (name !== null) {
                    user.name = name;
                }
                
                if (baby_birth_date !== null) {
                    user.baby_birth_date = baby_birth_date;
                }
                
                if (user.name && user.baby_birth_date) {
                    user.onboarding_done = true;
                }

                await user.save({fields: ['name', 'baby_birth_date', 'onboarding_done']})
                
                const token = jsonwebtoken.sign(
                    { id: user.id, user },
                    config.jwtSecret!,
                    { expiresIn: '1d' }
                )
            
                return res.send({token});    
            }
        }
        
        return res.status(403)
            .send(
                {
                    erro_code: 'TOKEN_INVALID',
                    msg: "Token invalid"
                }
            );
    } catch (error) {
        console.log('error', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401)
                .send(
                    {
                        erro_code: 'TOKEN_EXPIRED',
                        msg: "Token expired"
                    }
                );    
        } else {
            return res.status(500)
                .send(
                    {
                        erro_code: 'SERVER_ERROR',
                        msg: "An error occour, please try again!"
                    }
                );    
        }
    }   
}
