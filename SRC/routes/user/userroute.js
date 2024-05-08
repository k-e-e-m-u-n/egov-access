import express from 'express';

import {getAllUsers,getSingleUser} from '../../controllers/usercontroller.js';
import protectRoute from '../../midddlewares/protectedApps.js';


const router = express.Router();

router.get("/",getAllUsers)
router.get("/:id",getSingleUser)

export default router;