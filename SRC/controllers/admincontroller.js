import Admin from '../models/admin.model.js'
import User from '../models/user.models.js'
import Post from '../models/post.models.js' 
import {signUpValidator,logInValidator} from '../validators/admin.validator.js';
import { formatZodError } from '../utils/errorMessage.js';
import cryptoHash from 'crypto';
import generateTokenAndCookie from '../utils/generateTokenAndSetCookie.js';


export const createNewPost = async (req,res) => {
    try {

        const {
            postedBy,
            adminProfilePic,
            text,
            img,
            likes,
            comment,
            replies 
        } = req.body


        const imgUrls = req.files.map(file => file.path); // Get array of uploaded image URLs


        const newPost = new Post({
            postedBy,
            adminProfilePic,
            text,
            img: imgUrls,
            likes,
            comment,
            replies 
        });



        await newPost.save();
        res.status(201).json(newPost)
    } catch(error) {
         res.status(400).json({message: 'error creating post'})
    }
}


export const getAllUsers = async (req,res) => {
    try {
        const allUsers = await User.find();


        if(!allUsers) {
            res.status(400).json({messag:`no users found in database`})
        }else {
            res.status(200).json({message:`users found succesfully`,allUsers})
        }

    } catch {
        res.status(500).json({message: error.message})
        console.log(error);
    }
}

export const getSingleUser = async (req,res) => {
    try {
        const userId = req.params.userId;
        const singleUser = await User.findbyId(userId);

        if(!singleUser) {
            res.status(400).json({message:`no user found with such id:${userId} found`})    
        } else {
            res.status(200).json({message: `user f  ound succesfully`,singleUser})
        }

    } catch(error) {
        res.status(500).json({message: error.message})
        console.error(error);
    }

}

export const deleteSingleUser = async( req, res) => {
    try{
        const userId = req.params.id;
        const userToDelete = await User.findByIdAndDelete(userId);

        if (!userToDelete) {
            res.status(400).json({message: `no user with such id ${userId} found`})
        } else{
            res.status(200).json({message: `user deleted successfully`, userToDelete})
        }
    } catch(error) {
        res.status(500).json({message:error.message})
        console.error(error);
    }
}

export const deleteAllUsers = async ( req, res) => {
    try {
        const allUsers = await User.deleteMany();

        if(!allUsers) {
            res.status(400).json({message: 'no users found in database'})
        } else {
            res.status(200).json({message: 'Users found successfully', allUsers})
        }

    } catch(error) {
        res.status(500).json({message: error.message})
        console.error(error);
    }
}


export const updateUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const { password, ...rest } = req.body;
  
      if (password) {
        const hashedPassword = cryptoHash.createHash('sha256').update(password).digest('hex');
  
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { ...rest, password: hashedPassword },
          { new: true }
        );

        if (!updatedUser) {
          return res.status(404).json({ message: `User with id: ${userId} not found` });
        }

        return res.status(200).json({ message: 'User updated successfully', updatedUser });
      } else {
        const updatedUser = await User.findByIdAndUpdate(userId, rest, { new: true });
        if (!updatedUser) {
          return res.status(404).json({ message: `User with id: ${userId} not found` });
        } 
       
          return res.status(200).json({ message: 'User updated successfully', updatedUser });
      }
   
  }  catch (error) {
    console.error('Error while updating User:', error);
    res.status(400).json({ message: error.message});
}
};

// log in and sign up
////////




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
        const {name,email} = req.body;

        const admin = await Admin.findOne({$or:[{name},{email}]});

            // admin
            if(admin) {
                res.status(400).json ({message:'Admin already exists'})
            } else {
                const {
                    name,
                    password,
                    confirmPassword,
                    email
                } = req.body // request coming from the client
    
                if(password !== confirmPassword) {
                    return res.status(403).json({message:'password and cornfirmPassword do not match'})
                }
                const encryption = hashValue(password,confirmPassword);
                const newAdmin = new Admin ({
                    name,
                    password: encryption,
                    email
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
        const admin = await Admin.findOne({email})

        if (!admin) {
            return res.status(400).json(formatZodError
                (loginResults.error.issues)
            )
        }
           const comparePass = comparePasswords(password,admin.password);

        if(!comparePass) {
                res.status(400).json({message: 'Password is incorrect'})
            }
            res.status(200).json({message: 'Login Successful',admin})
       
    }  catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getSingleUsers = async() =>{}

export const logout = async ( req, res ,next) => {

}