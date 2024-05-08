import Post from '../models/post.models.js' 
import express from 'express'



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


        const newPost = new Post({
            postedBy,
            adminProfilePic,
            text,
            img,
            likes,
            comment,
            replies 
        });



        await newPost.save();
        res.status(201).json({message: 'Post succesfully created'},newPost)
    } catch(error) {
         res.status(400).json({message: 'error creating post'})
    }
}

export const getAllPost = async (res,req) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        res.status(404).json({message: 'No post found'});
    }
}

export const getSinglePost = async (res,req) => {
    try {
        const postId = req.params.id

        const singlePost = await Post.findId(postId)
        res.json(singlePost)
    } catch (error) {
        res.status(404).json({message: 'Post not found'})
    }
}

export const updatePost = async (res,req) => {
    try {
        const postId = req.params.id
        const postToUpdate = await Post.findById(postId);
        
        if(!postToUpdate) {
            return res.status(404).json({message: 'Post not found'})
        }

        await postToUpdate.updateOne(req.body);
        res.json(postToUpdate)

    } catch (error) {
        res.status(404).json({message: 'Error updating post'})
    }
}

export const deletePost = async (res,req) => {
    try {
        const postId = req.params.id;

        await Post.findByIdAndDelete(postId)
    } catch (error) {
        
    }
}

