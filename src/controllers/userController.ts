import {  Request, Response } from 'express';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../model/userModel';
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
        const user = await User.findByIdAndUpdate(request.params?.id, {
            ...request.body
        })
        const newUser = await User.findById(user?.id)
        return response.json({user: newUser})
    }
}
export default new UserController();