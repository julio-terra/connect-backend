import {  Request, Response } from 'express';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../model/userModel';
import Post from '../model/postModel';
import UploadImagesService from '../services/UploadImagesService';
import DeleteImagesService from '../services/DeleteImagesService';


class UserController {
    async register(request: Request, response: Response){
        const schema = yup.object().shape({
            displayName: yup.string().required(),
            email: yup.string().required().email(),
            password: yup.string().required().min(6)
        })

        if(!(await schema.isValid(request.body))){
            return response.json({error: true, message: 'Validation fails'});
        }

        const userExists = await User.findOne({email: request.body.email});

        if(userExists){
            return response.json({error: true, message: 'This user already exists'});
        }
        const user = await User.create(request.body);

        return response.json({user})
    }
    async session(request: Request, response: Response){
        const schema = yup.object().shape({
            email: yup.string().email().required(),
            password: yup.string().required().min(6)
        })
        if(!schema){
            return response.json({error: true, message: 'Validation fails'});
        }
        const user = await User.findOne({email: request.body.email});

        if(!user){
            return response.json({error: true, message: 'User not found'});
        }
        const isValid = await bcrypt.compare(request.body.password, user.password);

        if(!isValid){
            return response.json({error: true, message: 'This password is not valid'});
        }
        const accessToken = jwt.sign(
            { user_id: user.id },
            "mysecret",
            {expiresIn: '24h'}
        );
         return  response.json({ user, accessToken })
    }
    async updateImage(request: Request, response: Response){
        const user = await User.findOne({_id: request.params.id});
        /* if(user?.key){
            const deleteImageService = new DeleteImagesService();
            await deleteImageService.execute(user.key)
        } */
        if(request.file){
            const uploadImagesService = new UploadImagesService();
            await uploadImagesService.execute(request.file);
        }

        const newUser = await User.findByIdAndUpdate(user?.id,
            {
                fileName: request.file?.filename,
                key: request.file?.filename,
                fileUrl: `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${request.file?.filename}`
            });
        return response.json({user: newUser})
    }
    async updateBody(request: Request, response: Response){
        if(request.body.userName){
            const userExistis = await User.findOne({userName: request.body.userName});
            if(userExistis){
                return response.json({error: true, message: "this username is already in use"})
            }
        }
        User.findByIdAndUpdate(request.params?.id, {
            ...request.body
        }).then(async () =>{
            const newuser = await User.findOne({_id: request.params.id});
            return response.json({message: 'Done!', user: newuser})
        }).catch(() => {
           return response.json({error: true, message: "An unexpected error occurred"})
        })
    }
    async users(request: Request, response: Response){
        const users = await User.find().sort({folowers: 1});

        return response.json({users})
    }
    async user(request: Request, response: Response){
        const user = await User.findOne({_id: request.params.id});

        if(!user){
            return response.json({error: true, message: 'User not found'});
        }
        const followers = await User.find({following: {$in: [user._id]}});
        
        return response.json({ user:  {...user, followers }});
    }
    async posts(request: Request, response: Response){
        const posts = await Post.find({user_id: request.params.id}).sort({ createdAt: -1 });

        return response.json({posts});
    }
    async follow(request: Request, response: Response){
        const user = await User.findOne({_id: request.params.id});

        if(!user){
            return response.json({error: true, message: 'You need to login to follow users'});
        }
        
        await User.findByIdAndUpdate(user._id, {
            following: [...user.following, request.body.target_id]
        }).then(async () =>{
        const newuser = await User.findOne({_id: request.params.id});

            return response.json({message: 'Done!', user: newuser})
        }).catch(() => {
            return response.json({error: true, message: "An unexpected error occurred"})
        })
    }
    async unfollow(request: Request, response: Response){
        const user = await User.findOne({_id: request.params.id});

        if(!user){
            return response.json({error: true, message: 'You need to login to follow users'});
        }
        
        User.findByIdAndUpdate(user._id, {
            following: user.following.filter(e => e != request.body.target_id)
        }).then(async () =>{
            const newuser = await User.findOne({_id: request.params.id});
            return response.json({message: 'Done!', user: newuser})
        }).catch(() => {
            return response.json({error: true, message: "An unexpected error occurred"})
        })
    }
}
export default new UserController();