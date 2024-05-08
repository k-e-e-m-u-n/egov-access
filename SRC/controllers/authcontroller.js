import User from '../models/user.models.js'
import Admin from '../models/admin.model.js'
import {signUpValidator,logInValidator} from '../validators/auth.validator.js';
import { formatZodError } from '../utils/errorMessage.js';
import cryptoHash from 'crypto';
import generateTokenAndCookie from '../utils/generateTokenAndSetCookie.js';


//function for password hashing
function hashValue(value) {
    const hash = cryptoHash.createHash('sha256');

    hash.update(value);

    return hash.digest('hex')
};

// hashing the compared passwords
function comparePasswords(inputPassword, hashedPassword) {
    return hashValue(inputPassword) === hashedPassword
};

// validating the user input for sign up
export const signUp = async (req, res, next ) => {


    const registerResults = signUpValidator.safeParse(req.body) //safely parsing the validating the request againt the schema defined in our signupvalidator

    if (!registerResults) { 
        return res.status(400).json(formatZodError(registerResults.error.issues) )
    }
    try {
        const {name, phoneNumber, email} = req.body;

        const user = await User.findOne({$or:[{email},{phoneNumber}]});
        // const admin = await Admin.findOne({$or:[{name},{email}]});

        if(user) {
            res.status(400).json ({message:'user already exists'})
        } else {
            const {
                name,
                password,
                confirmPassword,
                email,
                phoneNumber,
                gender
            } = req.body //request coming from the user/client

            if(password !== confirmPassword) {
                return res.status(403).json({message:'password and cornfirmPassword do not match'})
            }
            const encryption = hashValue(password,confirmPassword); // encrypting the users password with the hash value function
            const newUser = new User ({
                name,
                password: encryption,
                confirmPassword: encryption,
                email,
                phoneNumber,
                gender
            }) // creating the new user 

            await newUser.save(); //saving the new user 
            res.status(200).json({message:'User resgistered succesfully', newUser})
            console.log('User registered succesfully',newUser);
        }
            // admin
            if(admin) {
                res.status(400).json ({message:'Admin already exists'})
            } else {
                const {
                    name,
                    password,
                    confirmPassword,
                    email,
                    bio
                } = req.body // request coming from the client
    
                if(password !== confirmPassword) {
                    return res.status(403).json({message:'password and cornfirmPassword do not match'})
                }
                const encryption = hashValue(password,confirmPassword);
                const newAdmin = new Admin ({
                    name,
                    password: encryption,
                    email,
                    phoneNumber,
                    bio,
                    gender
                })//creating a new admin
    
                await newAdmin.save(); //saving the new admin 
                res.status(200).json({message:'Admin resgistered succesfully', newAdmin})
                console.log('Admin registered succesfully',newAdmin);
    
    
            }
        
    } catch (error){
      res.status(500).json({message: error.message})  
      console.log(error.message);
    }
}

export const logIn = async (req, res, next) => {
    const loginResults = logInValidator.safeParse(req.body)

    if(!loginResults) {
        return res.status(400).json (formatZodError
            (loginResults.error.issues)
        )
    }
    try {
        const {email,password} = req.body;

        const user = await User.findOne({email})
        const admin = await Admin.findOne({email})

        if (!user) {
            return res.status(400).json(formatZodError
                (loginResults.error.issues)
            )
        }
        if (!admin) {
            return res.status(400).json(formatZodError
                (loginResults.error.issues)
            )
        }
           const comparePass = comparePasswords(password,user.password, admin.password);

        if(!comparePass) {
                res.status(400).json({message: 'Password is incorrect'})
            }
            res.status(200).json({message: 'Login Successful',user})
       
    }  catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getSingleUsers = async() =>{}

export const logout = async ( req, res ,next) => {

}