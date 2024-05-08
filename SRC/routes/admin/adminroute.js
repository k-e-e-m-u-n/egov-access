import express from 'express';
import { signUp, logIn } from '../../controllers/admincontroller.js';
import {createNewPost,deleteAllUsers,deleteSingleUser,getAllUsers,getSingleUser,updateUser,getAllPost,getSinglePost,updatePost,deletePost} from '../../controllers/admincontroller.js';
import protectRoute from '../../midddlewares/protectedApps.js';

const router = express.Router();

// router.get("/",getAllUsers)
router.get("/:id",getSingleUser)
router.get("/delete",deleteAllUsers)
router.get("/delete/:id",deleteSingleUser)
router.get("update/:id",updateUser)

router.post("/register",signUp);
router.post("/login",logIn);
router.post('/newpost',createNewPost);

router.get('/',getAllPost);
router.get('/:id',getSinglePost);


router.patch('/update/:id',updatePost);
router.delete('/delete/:id',deletePost)


export default router;