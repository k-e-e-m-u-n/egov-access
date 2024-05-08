import express from 'express';
import {getAllUsers,getSingleUser} from '../../controllers/usercontroller.js';
import protectRoute from '../../midddlewares/protectedApps.js';
import { signUp, logIn } from '../../controllers/authcontroller.js';


const router = express.Router();

router.post("/register",signUp);
router.post("/login",logIn);



router.get("/",getAllUsers)
router.get("/:id",getSingleUser)

export default router;