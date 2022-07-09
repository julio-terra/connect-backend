import {  Request, Response } from 'express';
import * as yup from 'yup';

import Post from '../model/postModel';
import UploadImagesService from '../services/UploadImagesService';
import DeleteImagesService from '../services/DeleteImagesService';


class UserController {
    async new(request: Request, response: Response){
        const schema = yup.object().shape({
            user_id: yup.string().required(),
            displayText: yup.string()
        })
        if(!(await schema.isValid(request.body))){
            return response.json({error: true, message: 'Error'});
        }
        if(!request.body.displayText && !request.file){
            return response.json({error: true, message: 'the fields were not filld'});
        }
        if(!request.file){
            await Post.create({...request.body})
            return response.json({message: 'Done'})
        }
        if(request.file){
            const uploadImagesService = new UploadImagesService();
            await uploadImagesService.execute(request.file);
            
            await Post.create({
                ...request.body,
                fileName: request.file.filename,
                key: request.file.filename,
                fileUrl: `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${request.file?.filename}`
            }).then(() =>{
                return response.json({message: 'Done!'})
            }).catch(() =>{
                return response.json({error: true, message: 'An unexpected error occurred'})
            })
        }
    }
    async delete(request: Request, response: Response){
        const post = await Post.findOne({_id: request.params.id})

        if(!post){
            return response.json({error: true, message: 'this post has already been deleted'})
        }
        /* if(post.key){
            const deleteImageService = new DeleteImagesService();
            await deleteImageService.execute(post.key)
        } */
        post.remove().then(() =>{
            return response .json({message: 'Done!'})
        }).catch(() =>{
            return response.json({error:true, message: 'An unexpected error occurred'})
        })
    }
    async list(request: Request, response: Response){
        const posts = await Post.find({user_id: {$in: request.body.following}}).sort({createdAt: -1});
        
        return response.json({posts})
    }
}
export default new UserController();