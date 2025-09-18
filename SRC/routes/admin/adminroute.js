import express from 'express';
import { signUp, logIn } from '../../controllers/admincontroller.js';
import {createNewPost,createComment,deleteAllUsers,deleteSingleUser,getAllUsers,getSingleUser,updateUser,getAllPost,getSinglePost,updatePost,deletePost,deleteAllPosts,likePost,addCommentToPost,getPostComments,addReplyToPost,getPostReplies} from '../../controllers/admincontroller.js';
import protectRoute from '../../midddlewares/protectedApps.js';

const router = express.Router();

router.get("/getUsers",getAllUsers)
router.get("/:id",getSingleUser)
router.get("/delete",deleteAllUsers)
router.get("/delete/:id",deleteSingleUser)
router.get("update/:id",updateUser)

router.post("/register",signUp);
router.post("/login",logIn);
router.post('/newpost',createNewPost);

router.post("/newcomment",createComment)

router.get('/',getAllPost);
router.get('/:id',getSinglePost); 


router.patch('/update/:id',updatePost);
router.delete('/delete/id',deletePost);
router.delete('/deleteAllPosts',deleteAllPosts);

router.post('/posts/:id/like',likePost);
router.post('/posts/:id/comments',addCommentToPost);
router.get('/posts/:id/comments',getPostComments);
router.post('/posts/:id/replies',addReplyToPost);
router.get('/posts/:id/replies',getPostReplies);


export default router;