import express from 'express';
import { createNewPost,getAllPost,getSinglePost,updatePost,deletePost} from '../../controllers/postcontroller.js';
import protectRoute from '../../midddlewares/protectedApps.js';


const router = express.Router();

router.post('/newpost',createNewPost);
router.get('/',getAllPost);
router.get('/:id',getSinglePost);
router.patch('/update/:id',updatePost);
router.delete('/delete/:id',deletePost)

export default router;