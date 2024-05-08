import express from 'express';
import { signUp, logIn } from '../../controllers/authcontroller.js';


const Router = express.Router();

Router.post("/register",signUp);
Router.post("/login",logIn);


export default Router;