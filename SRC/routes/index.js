import express from 'express';
import authroute from '../routes/auth/authroute.js';
import userroute from '../routes/user/userroute.js';
import adminroute from '../routes/admin/adminroute.js';
import postroute from '../routes/post/postroute.js'



const router = express.Router();


router.use('/auth',authroute);
router.use('/user',userroute);
router.use('/admin', adminroute)
router.use('/post',postroute)



export default router